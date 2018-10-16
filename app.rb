require 'socket'
require 'timeout'
require 'sinatra'
require 'sinatra-websocket'
require 'sinatra/reloader' if development?

set :server, 'thin'
set :sockets, []

g_data = Array.new(16*8*32)

get '/' do
    send_file File.join(settings.public_folder, 'index.html')
end

get '/api/led' do
    content_type :json
    g_data.to_json
end

get '/websocket' do
    if request.websocket?
        request.websocket do |ws|
            ws.onopen do
                settings.sockets << ws
            end
            ws.onmessage do |msg|
            end
            ws.onclose do
                settings.sockets.delete(ws)
            end
        end
    end
end

def rgb565to888(c565)
    r = (c565 & 0b1111100000000000) >> 8
    g = (c565 & 0b0000011111100000) >> 3
    b = (c565 & 0b0000000000011111) << 3
    return (r << 16) + (g << 8) + b
end

thr = Thread.new{
UDPSocket.open do |recv_sock|
    recv_sock.bind('0.0.0.0', 9001)
    update_time = Time.now
    while true
        begin
            data = recv_sock.recv(8192)
            for z in 0...8 do
                for y in 0...32 do
                    for x in 0...16 do
                        idx565 = (z + y*8 + x*32*8)*2
                        idx888 = (z + y*8 + x*32*8)
                        c565 = ((data[idx565].unpack('C*')[0]) <<8) + data[idx565+1].unpack('C*')[0]
                        r = (c565 & 0b1111100000000000) >> 8
                        g = (c565 & 0b0000011111100000) >> 3
                        b = (c565 & 0b0000000000011111) << 3
                        rgb = (r << 16) + (g << 8) + b
                        g_data[idx888] = rgb
                        
                        current_time = Time.now
                        if current_time - update_time > 0.05
                            update_time = current_time
                            settings.sockets.each do |s|
                                s.send(g_data.to_json)
                            end
                        end
                    end
                end
            end
        end
    end
end
}

