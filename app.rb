# frozen_string_literal: true

require 'socket'
require 'timeout'
require 'sinatra'
require 'sinatra-websocket'
require 'sinatra/reloader' if development?

set :server, 'thin'
set :sockets, []

g_data = Array.new(16 * 8 * 32)

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
  (r << 16) + (g << 8) + b
end

thr = Thread.new do
  UDPSocket.open do |recv_sock|
    recv_sock.bind('0.0.0.0', 9001)
    update_time = Time.now
    loop do
      data = recv_sock.recv(8192)
      (0...8).each do |z|
        (0...32).each do |y|
          (0...16).each do |x|
            idx565 = (z + y * 8 + x * 32 * 8) * 2
            idx888 = (z + y * 8 + x * 32 * 8)
            c565 = (data[idx565].unpack1('C*') << 8) + data[idx565 + 1].unpack1('C*')
            g_data[idx888] = rgb565to888(c565)

            current_time = Time.now
            next unless current_time - update_time > 0.05

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
