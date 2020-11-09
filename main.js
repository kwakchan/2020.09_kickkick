var url = require('url');
var qs = require('querystring');

var express = require('express');
var app = express();

var matching_template = require('./lib/matching.js');
var matching_make_template = require('./lib/matching_make.js');
var matching_management_template = require('./lib/matching_management.js');
var matching_management_update_template = require('./lib/matching_management_update.js');

var hero_template = require('./lib/hero.js');
var hero_make_template = require('./lib/hero_make.js');
var hero_management_template = require('./lib/hero_management.js');
var hero_management_update_template = require('./lib/hero_management_update.js');

var user_template = require('./lib/user.js');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

var mysql = require('mysql');
var db = mysql.createConnection({
  host: 'localhost',//'202.30.32.218',
  port: '3305',//'3306',
  user:'root',
  database: 'kickkick',
  dateStrings: 'date',
});
db.connect();

// Loading 로딩----------------------------------------------
app.get('/', function(request, response){
  var loading = require('./lib/loading');
  response.send(loading);
});

// Login 로그인
app.get('/login', function(request, response){
  var login = require('./lib/login');
  response.send(login);
});

// matching 리스트--------------------------------------------
app.get('/matching', function(request, response){  
  db.query(`SELECT * FROM matching`, function(error,topics){
    if(error){
      throw error;
    }
    var list = matching_template.list(topics);
    var matching = matching_template.HTML(list);
  response.send(matching);
  });
});

//maching 방만들기
app.get('/matching/matching_make', function(request, response){
  var matching_make = matching_make_template.HTML();
  response.send(matching_make);
});

//maching 방만들기 프로세스
app.post('/matching/create_process', function(request, response){
  var post = request.body;
  var title = post.form_title;
  var date = post.form_date;
  var time = post.form_time;
  var content = post.form_content;
  
  sql = "INSERT INTO matching (title, date, time, content) VALUES(?,?,?,?);";
  db.query(sql,[title, date, time, content],function(error, result){
      if(error){
        throw error;
      }
      response.writeHead(302, {Location: `/matching`}); 
      response.end();
  });    
});

//matching 관리(수정, 삭제)
app.get('/matching/matching_management', function(request, response){
  var queryData = url.parse(request.url, true).query; 

  db.query(`SELECT * FROM matching where id=?`,[queryData.id],function(error2, topic){
    var title = topic[0].title;
    var date = topic[0].date;
    var time = topic[0].time;
    var content = topic[0].content;        
    var queryData_id = queryData.id;
    
    if(error2){
      throw error;
    }
    var matching_management = matching_management_template.HTML(title, date, time, content, queryData_id);
    response.send(matching_management);  
  });    
});       

//matching 관리 방수정
app.get('/matching/matching_management/update', function(request, response){
  db.query(`SELECT * FROM matching where id=?`, [queryData.id],function(error2, topic){
    var title = topic[0].title;
    var date = topic[0].date;
    var time = topic[0].time;
    var content = topic[0].content;
    var queryData_id = queryData.id;        
    
    if(error2){
      throw error;
    }
    var matching_management_update = matching_management_update_template.HTML(title, date, time, content, queryData_id);
    response.writeHead(200);
    response.end(matching_management_update); 
  });   
});

//matching 관리 방수정 프로세스
app.post('/matching/matching_management/update_process', function(request, response){
  var queryData = url.parse(request.url, true).query; 
  
  var post = request.body;
  var title = post.update_title;
  var date = post.update_date;
  var time = post.update_time;
  var content = post.update_content;
  var queryData_id = queryData.id;

  db.query('UPDATE matching SET title=?, date=?, time=?, content=? WHERE id=?', [title, date, time, content, queryData_id], function(error, result){
    response.writeHead(302, {Location: `/matching`});
    response.end();
  }) 

});


//matching 관리 방삭제 프로세스
app.get('/matching/matching_management/delete_process', function(request, response){
  var queryData = url.parse(request.url, true).query; 
  
  var post = request.body;
  var queryData_id = queryData.id;
  db.query('DELETE FROM matching WHERE id = ?', [queryData_id], function(error, result){
    if(error){
      throw error;
    }
    response.writeHead(302, {Location: `/matching`});
    response.end();
  });
});

//hero 리스트-------------------------------------------
app.get('/hero', function(request, response){
  db.query(`SELECT * FROM hero`, function(error,topics){
    if(error){
      throw error;
    }
    var list = hero_template.list(topics);
    var hero = hero_template.HTML(list);
    response.send(hero);
  });
});

//hero 방만들기
app.get('/hero/hero_make', function(request, response){
  var hero_make = hero_make_template.HTML();
  response.send(hero_make);
});

//hero 방만들기 프로세스
app.post('/hero/create_process', function(request, response){
  var post = request.body;
  var name = post.form_name;
  var date = post.form_date;
  var time = post.form_time;
  var content = post.form_content;
  
  sql = "INSERT INTO hero (name, date, time, content) VALUES(?,?,?,?);";
  db.query(sql,[name, date, time, content],function(error, result){
      if(error){
        throw error;
      }
      response.writeHead(302, {Location: `/hero`}); 
      response.end();
  });
});

//hero 관리(수정, 삭제)
app.get("/hero/hero_management", function(request, response){
  var queryData = url.parse(request.url, true).query; 

  db.query(`SELECT * FROM hero where id=?`,[queryData.id],function(error2, topic){
    var name = topic[0].name;
    var date = topic[0].date;
    var time = topic[0].time;
    var content = topic[0].content;        
    var queryData_id = queryData.id;
    
    if(error2){
      throw error;
    }
  var hero_management = hero_management_template.HTML(name, date, time, content, queryData_id);
  response.send(hero_management);
 }); 
});

//hero 관리 방수정
app.get("/hero/hero_management/update", function(request, response){
  var queryData = url.parse(request.url, true).query; 

  db.query(`SELECT * FROM hero where id=?`,[queryData.id],function(error2, topic){
    var name = topic[0].name;
    var date = topic[0].date;
    var time = topic[0].time;
    var content = topic[0].content;
    var queryData_id = queryData.id;        
    
    if(error2){
      throw error;
    }
    var hero_management_update = hero_management_update_template.HTML(name, date, time, content, queryData_id);
    response.send(hero_management_update); 
  });     
});

//hero 관리 방수정 프로세스
app.post('/hero/hero_management/update_process', function(request, response){
  var queryData = url.parse(request.url, true).query; 

  var post = request.body;
  var name = post.update_name;
  var date = post.update_date;
  var time = post.update_time;
  var content = post.update_content;
  var queryData_id = queryData.id;
  console.log(name, date, time, content, queryData_id);
  
  db.query('UPDATE hero SET name=?, date=?, time=?, content=? WHERE id=?', [name, date, time, content, queryData_id], function(error, result){
    response.writeHead(302, {Location: `/hero`});
    response.end();
  })
});

//hero 관리 방삭제 프로세스
app.get('/hero/hero_management/delete_process', function(request, response){
  var queryData = url.parse(request.url, true).query; 
  
  var post = request.body;
  var queryData_id = queryData.id;
  db.query('DELETE FROM hero WHERE id = ?', [queryData_id], function(error, result){
    if(error){
      throw error;
    }
    response.writeHead(302, {Location: `/hero`});
    response.end();
  });
});

//team 팀 -------------------------------------
app.get('/team', function(request, response){
  var team = require('./lib/team');
  response.send(team);
});

//team 관리
app.get('/team/team_management', function(request, response){
  var team_management = require('./lib/team_management');
  response.send(team_management);  
});

//team 프로필
app.get('/team/team_management_profile', function(request, response){
  var team_management_profile = require('./lib/team_management_profile');
  response.send(team_management_profile);
});

//chat 채팅------------------------------------ 
app.get('/chat', function(request, response){
  var chat = require('./lib/chat');
  response.send(chat);  
});

//user 유저------------------------------------
app.get('/user', function(request, response){
  var queryData = url.parse(request.url, true).query; 

  db.query(`SELECT * FROM user where id=?`, [queryData.id], function(error,topics){
    if(error){
      throw error;
    }
  var user = user_template.HTML(topics);
  response.send(user);
  });  
});

app.get('/user_create', function(request, response){
  var queryData = url.parse(request.url, true).query; 

  db.query(`create * FROM user where id=?`, [queryData.id], function(error,topics){
    if(error){
      throw error;
    }
  var user = user_template.HTML(topics);
  response.send(user);
  });  
});

app.listen(3000, function() {
  console.log('Let`s go Kick Kick')
});
/*


  //[---------------------에러 error---------------------]
  else {
  response.writeHead(404);
  response.end('Not found');
  }

});
app.listen(3000, function() {
  console.log('Let`s go to [kick kick]!')
});

*/