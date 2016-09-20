from jinja2 import Template
t = Template("Hello {{ something }}!")
t.render(something="World")
#u'Hello World!'

t = Template("My favorite numbers: {% for n in range(1,10) %}{{n}} " "{% endfor %}")
t.render()
#u'My favorite numbers: 1 2 3 4 5 6 7 8 9 '
