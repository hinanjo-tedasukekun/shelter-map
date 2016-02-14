require 'sinatra'

get '/' do
  redirect '/map.html', 301
end
