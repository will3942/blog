worker_processes 4
APP_PATH="/var/www/blog"
working_directory APP_PATH

listen APP_PATH + "/tmp/sockets/unicorn.sock", :backlog => 64

timeout 30

pid APP_PATH + "/tmp/pids/unicorn.pid"

stderr_path APP_PATH + "/logs/stderr.log"
stdout_path APP_PATH + "/logs/stdout.log"

preload_app true
GC.respond_to?(:copy_on_write_friendly=) and
  GC.copy_on_write_friendly = true

check_client_connection false

before_fork do |server, worker|
  defined?(ActiveRecord::Base) and
    ActiveRecord::Base.connection.disconnect!
end

after_fork do |server, worker|
  defined?(ActiveRecord::Base) and
    ActiveRecord::Base.establish_connection
end
