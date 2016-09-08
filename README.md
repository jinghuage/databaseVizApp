# gp41_genbank_sample

Sep 6, 2016 log:
-----------------

Rewrite standalone application with nodejs application structure:

  - package management : npm, bower
  - testing: mocha, chai, and sinon?
  - server side : may need to connect to database directly for query
  - server side : may need to handle user login
  - client side : use bootstrap for html layout
  - client side : thought about angularjs but don't think need it at this stage.


Git Repo:

  - git: https://github.com/jinghuage/gp41_genbank_sample.git
  - branch: step-0 for empty project structure


Sep 8, 2016 log:
-----------------

Use AngularJS for a locally routed app:

  - view #1: Basic header and footer, and show list of databases, for each database, provide link to their visualization page, which is view #2 routed by AngularRoute. Contains a side bar for search, and a main body for list view.
  - view #2: visualization page for a database, pull viz from tableau public. Has a navbar which can navigate through available views. Contains side bar for tools, and main body for viz view.
  
