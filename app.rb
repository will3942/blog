require 'bundler/setup'
require 'sinatra'
require 'sinatra/assetpack'
require 'github/markup'

class Blog < Sinatra::Application
  set :root, File.dirname(__FILE__)
  register Sinatra::AssetPack

  assets do

    serve '/js',  from: 'js'
    serve '/css', from: 'css'

    js :application, [
      '/js/*.js'
    ]

    css :application, [
      '/css/*.css'
    ]

    js_compression :jsmin
    css_compression :simple
  end


  get '/' do
    
    @files = Array.new
    @dir = File.dirname(__FILE__)
    
    Dir.glob(File.dirname(__FILE__) + '/posts/*.md') do |post|
      @files.push(post)
    end
    
    @files = @files.sort_by {|x| DateTime.parse(IO.readlines(x)[1].to_s) }.reverse
    
    erb :index

  end

  get '/about' do

    @filepath = File.dirname(__FILE__) + "/posts/about"
    @name = @filepath.gsub(File.dirname(__FILE__) + '/posts/', "").gsub(".md", "")
    @contents = IO.readlines(@filepath)

    erb :about

  end

  get '/:name' do
    
    @filepath = File.dirname(__FILE__) + "/posts/#{params[:name]}.md"
    @name = @filepath.gsub(File.dirname(__FILE__) + '/posts/', "").gsub(".md", "")
    @contents = IO.readlines(@filepath)
    
    erb :post

  end

end
