var pages = [
    { el: 'pageReleases', hash: '', title: 'Релизы', callback: [ loadReleases, loadFilters ] },
    { el: 'pageCalendar', hash: '#calendar', title: 'Расписание'},
    { el: 'pageTeam', hash: '#team', title: 'Команда проекта'},
    { el: 'pageReleaseWatch', hash: '#watch', title: 'Загрузка...', callback: [ loadRelease ]},
]
    
var specialPages = new Object({
    '404': { el: 'page404', title: 'Нечего не найдено :/' },
    'loader': { el: 'spin', title: 'Загрузка...' }
})

function hashRouter(){
    var mainHash = window.location.hash.match(/^(#)+(\w*)/)
    if(mainHash){
        mainHash = mainHash[0];
    }
    else{
        mainHash = "" 
    }

    var elLoader = document.getElementById(specialPages.loader.el)

    document.getElementById('mainBlank').append(elLoader)

    pages.forEach(element => {
        if(element.hash == mainHash){

            document.title = element.title

            document.getElementById('mainBlank').innerHTML=''
            document.getElementById('mainBlank').innerHTML=document.getElementById(element.el).outerHTML

            if(element.callback){
                element.callback.forEach(elem =>{
                    testfunc(elem)
                })
            }   
        }
    });

}
onhashchange = function(){
    hashRouter()
}
function testfunc(callback){
    return callback()
}