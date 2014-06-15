How to code a markdown blogging system in Go
3rd December 2013
This is the first time I've ever coded in Go, I'll be replicating the custom blog system that powers this blog in Go using markdown files as blog posts. This post is designed to be a walkthrough and introduction to the Go language (on OS X). 

## What is Go?

[Go][1] is an open source programming language developed by Google (+ contributors) designed to make "it easy to build simple, reliable, and efficient software". It's available for Linux, OS X, Windows + more. 

## Installing Go from binary

1.  Download the Go binary [here][2] and extract it to */usr/local* (the archive name will probably be different depending on your system type) `
sudo tar -C /usr/local -xzf go1.2.darwin-amd64-osx10.8.tar.gz
`
2.  Add this line to */etc/profile* for a system-wide installation or to the *.profile* file in your home folder  
    `
export PATH=$PATH:/usr/local/go/bin
`
3.  You're going to want to make a directory in your home folder for where all your Go projects will be located (so dependencies can install correctly). For me this is `/Users/will3942/projects/go`. Projects should then be created like `/Users/will3942/projects/go/src/projectname`. To make sure dependencies install we need to define the GOPATH environment variable with the directory, for me I will add this to my */etc/profile* or the *.profile* in my home folder:  
    `
export GOPATH="/Users/will3942/projects/go"
`  
    
4.  Open a new shell window and everything should work!  
    

## Make our first project

First we need to create a new directory to work in, open a shell prompt and run:  
`
mkdir go-blog && cd go-blog
`

Now we need to create our first Go program, create a file named *blog.go* put this code in:  
<code gist="https://gist.github.com/will3942/7793171.json" file=""></code> Run the program with `go run blog.go` and if all goes well the output will be: `Hello World!` 

That's our first Go program created!

## Launching a Web Server in Go

To create a simple blog we need something to serve the web pages, in this case we will use *net/http*, lets create a web server! <code gist="https://gist.github.com/will3942/7793213.json" file=""></code> This is our simple web server, we simply import two packages and create a *handlerequest* function to handle **all** HTTP requests and then serve to the client the path they requested.  
Try going to `http://localhost:8000/hacker-news` and it should display *Hi you accessed post hacker-news*.  
That's it, our web server is up and running! 

## Using templates in Go

Go comes packaged with its own templating system, simply import *html/template* and we're done! Now lets try passing some data to a template. First create a new HTML file called *index.html* and add the following to it.

<code gist="https://gist.github.com/will3942/7793128.json" file=""></code>

In this code you can see that we have `{{.}}` which allows us to access a variable we will pass later.

Change your *blog.go* file to display this: <code gist="https://gist.github.com/will3942/7793232.json" file=""></code> Here you can see we've imported *html/template* to allow us to use templating and then also created a new template, parsed the existing *index.html* file and then using `t.Execute(w, title)` we passed the *title* variable to the template and executed it to the *http.ResponseWriter* output using variable *w*. Now if you go to `http://localhost:8000/` it should show *Hello World!* passed into the new template.

## Reading markdown files

Using the Go blackfriday Markdown package provided by [russross][3] [here][4] we can easily parse markdown in Go and that's what we'll be using for our blogging system. First we want to adjust our template (*index.html*) so we can iterate over an array: <code gist="https://gist.github.com/will3942/7794287.json" file=""></code> Then we need to create a new directory `mkdir posts` to store our markdown files in. We should then create a new post in that directory called `test.md` with the following content: <code gist="https://gist.github.com/will3942/7794338.json" file=""></code> For this blogging system the files take the following format: Title on the first line, Date on the second, Summary on the third and the main post for the rest of the file. 

Now we need to get to blackfriday package to parse markdown, we do this with the command `go get github.com/russross/blackfriday`. 

Now we need to adjust *blog.go* to parse these new files and display the title, date and summary on the index template. <code gist="https://gist.github.com/will3942/7795299.json" file=""></code>

Now we have a lot of changes here, firstly we are importing new packages. We have imported *io/ioutil* to read files, *strings* to manipulate strings (when we are reading out titles and such) and *blackfriday* to parse markdown.  
<code gist="https://gist.github.com/will3942/7795457.json" file=""></code> Next we declare a *Post* object with its data as strings. Our *handlerequest* function is almost the same, except we now pass *getPosts()* to the *posts* variable and then pass that to the template.  
<code gist="https://gist.github.com/will3942/7795461.json" file=""></code> The *getPosts()* function is completely new, after delcaring the name we put `[]Post`, now I must admit this caught me out and I had errors for a while but this is needed since it specifies the returned value's type, in our case an array of our *Post* object.  
<code gist="https://gist.github.com/will3942/7795477.json" file=""></code> We then define an array, *a* to hold our posts and then start reading the list of files in our directory using *path/filepath*, this returns an array of file paths which we then loop through. We start by getting only the filename in the *file* variable by replacing "posts/" and the markdown extension (".md") with blank strings.  
<code gist="https://gist.github.com/will3942/7795487.json" file=""></code> After this we read each individual file and then split the file into an array of strings, separated by newlines. We then read the title, date and summary by just pointing to this array and then the body by getting the rest of the file and then passing it to the blackfriday markdown parser using a byte slice.  
<code gist="https://gist.github.com/will3942/7795495.json" file=""></code> Finally we append these values to the *Posts* array and then return it after we've completed this for every file.  
<code gist="https://gist.github.com/will3942/7795507.json" file=""></code>

## Individual Posts

Now we need to parse the path and then get an individual post and display it in a new template! We simply create a new template without the loop through the array, named *post.html*:  
<code gist="https://gist.github.com/will3942/7795992.json" file=""></code> Then we just adjust the *handlerequest* function to check if the URL's path if is blank, if it is then just display the homepage else display the post's page (we copy the code from the getPosts function to do the parsing):  
<code gist="https://gist.github.com/will3942/7795951.json" file=""></code>

## We're done!

That's it, we've created a **very** simple blogging system using Markdown in Go. Hopefully this is somewhat helpful, it's definitely not the best Go code since I have only just started using it. The full code is below. You can find me on [twitter @Will3942][5] and you can comment on this article at Hacker News [here][6]. 

<code gist="https://gist.github.com/will3942/7796003.json" file=""></code>

 [1]: http://golang.org
 [2]: https://code.google.com/p/go/downloads/list?q=OpSys-FreeBSD+OR+OpSys-Linux+OR+OpSys-OSX+Type-Archive
 [3]: http://github.com/russross
 [4]: https://github.com/russross/blackfriday
 [5]: http://twitter.com/will3942
 [6]: https://news.ycombinator.com/item?id=6850428