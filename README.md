# led_simulator_js (3D LED CUBE Simulator)

## Requiments

Ruby 2.5.x  
Web Browser  

## How to Setup

1. `$ git clone https://github.com/YGFYHD2018/led_simulator_js.git`  
2. `$ cd led_simulator_js`  
3. `$ cd bundle install`  

## How to Run

1. `$ bundle exec ruby app.rb`
2. Open URL "http://localhost:4567" with a browser that you like.


## Let's test 3d_led_cube_go with led_simulator_js

1. Set up 3d_led_cube_go.  
Set up instraction is https://github.com/YGFYHD2018/3d_led_cube_go/blob/master/README.md
2. Launch 3d_led_cube_go with option `-d (IP address simulator running):9001`.  
ex)  
`$ go run main.go -d 192.168.0.11:9001`  
or  
`$ go build`  
`$ ./3d_led_cube_go -d 192.168.0.11:9001` 

3. Enter the test command `show:{"orders":[{"id":"object-rocket", "lifetime":3}]}` + press enter key.
4. Go back the browser window which you have opend at step 'How to Run'#2. 

You will see a rocket picture in the simulator.

