require "stringex"
class Place < Thor
  desc "new", "create a new place"
  method_option :editor, :default => "atom"
  def new(*placeid)
    placeid = Time.now.strftime('%y%m%d%k%M%S%L')
    date = Time.now.strftime('%Y-%m-%d')
  	timestamp = Time.now.strftime('%Y-%m-%d %T %z')
    filename = "_src/_places/#{placeid}.md"

    if File.exist?(filename)
      abort("#{filename} already exists!")
    end

    puts "Creating new place: #{filename}"
    open(filename, 'w') do |post|
      post.puts "---"
      post.puts "layout: place"
      post.puts "placeid: \"#{placeid}\""
  	  post.puts "date: #{timestamp}"
      post.puts "lat: "
      post.puts "long: "
      post.puts "---"
    end

    system(options[:editor], filename)

  end
end
