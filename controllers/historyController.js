const cheerio = require('cheerio');
const request = require('request');

module.exports = {
    getTeams: function (req,res,next) {
        request('https://www.promiedos.com.ar/historiales', (err,resr,body)=>{
            if(!err && resr.statusCode == 200){
                let $ = cheerio.load(body);
                let teams = [];
                            
                let team = $('#clubhist a');
                team.each(function(i,el){
                    teams.push({
                        id: $(this).attr("href").split("=")[1],
                        name: encodeURI($(this).text()) //por deportivo Español
                    })
                });

                res.send({
                    status: "success",
                    teams
                });
            } else {
                res.send({
                    status: "error",
                    message: "Error al cargar equipos disponibles"
                });
            }
        });
    },
    getHistoryByTeam: function (req,res,next){
        team = req.params.team;
        request('https://www.promiedos.com.ar/historiales='+team, (err,resr,body)=>{
            if(!err && resr.statusCode == 200){
                let $ = cheerio.load(body);
                let responseHistory = [];
                            
                let history = $('#historial tbody tr');
                history.each(function(i,el){
                    let name = $(this).children('td').eq(0).text();
                    name = encodeURI(name.substring(3,name.length));
                    let win = $(this).children('td').eq(3).text();
                    let draw = $(this).children('td').eq(4).text();
                    let loss = $(this).children('td').eq(5).text();
                    let id = $(this).children('td').eq(6).find('a').attr("href");
                    id = id.substring(id.indexOf("equipo2=")+8);
                    console.log(id);
                    responseHistory.push({
                        id,
                        name,
                        win,
                        draw,
                        loss
                    })
                });

                if(responseHistory.length == 0) {
                    res.send({
                        status: "error",
                        message: "No hay historial para el equipo id " + team
                    });    
                } else {
                    res.send({
                        status: "success",
                        responseHistory
                    });
                }
            } else {
                res.send({
                    status: "error",
                    message: "Error al cargar el historial del equipo id " + team
                });
            }
        });
    },
}