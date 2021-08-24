function search(){
    var resultOut = document.getElementById('navSearchResult')
    resultOut.innerHTML='<a class="dropdown-item" href="#">Введите название для поиска</a>'
    if(document.getElementById('navSearch').value != ""){
        $.get({
            url: 'https://api.anilibria.tv/v2/searchTitles',
            data: `search=${document.getElementById('navSearch').value}&limit=10&filter=names,status,id,code`,
            success: function(response){
                resultOut.innerHTML=''
                var resultItem, release_name;
                
                response.forEach(element => {
                    status = null
                    if(element.status.string == "В работе"){
                        status = 'info'
                    }else if(element.status.string == "Завершен"){
                        status = 'success'
                    }
                    else{
                        status = 'warning'
                    }
                    resultItem = document.createElement('li')
                    resultItem.innerHTML=`<a class="dropdown-item" href="./release#watch?r=${element.id}"><span class="d-inline-block bg-${status} rounded-circle" style="width: .5em; height: .5em;"></span> ${element.names.ru}</a>`
                    resultOut.appendChild(resultItem)
                });
                if(!response[0]){
                    resultItem = document.createElement('li')
                    resultItem.innerHTML=`<a class="dropdown-item" href="#">Нечего не найдено :/</a>`
                    resultOut.appendChild(resultItem)
                }
            } 
        })

    }
}

function randomTitle(){
    $.get({
        url: 'https://api.anilibria.tv/v2/getRandomTitle',
        data: 'filter=code,names,id',
        success: function(response){
            window.location.hash="#watch?r="+ response.id
        }
    })
}
var limit = 36
function loadReleases(more, mainEl){
    var mainEl;
    var loader = document.querySelector('#loader')

    if(loader.getAttribute('hidden') == ''){
        loader.removeAttribute('hidden')
    }

    document.querySelector('#loader > button').setAttribute('hidden', '')
    
    if(more == true){
        limit = limit+36
    }

    var card, order_by, sort_direct;
    var elemReleases = document.getElementById('releases')
    var filterForm = document.forms.filters;

    order_by = document.getElementById('sortBy').value
    sort_direct = document.getElementById('sortDirection').value
    if(!sort_direct){
        sort_direct = 0
    }

    var filters = '';
    

    $.get({
        url: 'https://api.anilibria.tv/v2/advancedSearch',
        //data: `limit=${limit}&filter=id,names,poster,type,season,in_favorites${getUrlSelected()}`,
        data: `query={in_favorites}${filters}&filter=id,names,poster,type,season,in_favorites&sort_direction=${sort_direct}&limit=${limit}&order_by=${order_by}`,
        success: function(response){
            if(!loader.getAttribute('hidden')){
                loader.setAttribute('hidden', '')
                document.querySelector('#loader > button').removeAttribute('hidden')
            }

            elemReleases.innerHTML=null

            //console.log(response)
            
            response.forEach(elem =>{
                card = document.createElement('div')
                card.className='col'
                card.innerHTML=`
                <a href="./release#watch?r=${elem.id}"><div class="card p-2 m-0 shadow btn" type="button">
                <img class="img rounded-1" src="https://static.anilibria.tv${elem.poster.url}" alt="">
                    <div style="text-align: center;" class="pt-1">
                        <h5 hidden class="text-danger">${elem.names.ru}</h5>
                        <span class="text-secondary">${elem.season.year} / ${elem.type.string}</span>
                        <p class="m-0 text-secondary"><i class="fas fa-star text-warning"></i> ${elem.in_favorites}</p>
                    </div>
                </div></a>`
                
                elemReleases.appendChild(card)

            });
        }
    })
}


function loadRelease(mainEl){
    var mainEl = document.querySelector('.releasePage')
    var spinner = document.querySelector('.releasePage, .loader')


    var rid = getUrlVars()['r']
    var elTorrents = document.getElementById('torrents')

    mainEl.setAttribute('hidden', '')
    spinner.removeAttribute('hidden')

    $.get({
        url: 'https://api.anilibria.tv/v2/getTitle',
        data: 'id='+rid,
        statusCode: {
            404: function() {
                document.getElementById('mainBlank').innerHTML=`<h1>Нечего не найдено :/</h1>`
            }
        },
        success: function(response){

            if(response.status.string == 'В работе'){
                document.getElementById('releaseTitle').innerHTML=`${response.names.ru} <span class="badge bg-success">Выходит</span>`

                if(response.announce){
                    document.getElementById('announce').innerHTML=`${response.announce}`
                }

            }else{
                document.getElementById('releaseTitle').innerHTML= response.names.ru
            }

            if(response.names.alternative){
                document.getElementById('releaseTitleAlt').innerHTML=response.names.alternative
            }
    
            document.title = response.names.ru + " / " + response.names.en
            document.getElementById('releasePoster').setAttribute('src' , `https://www.anilibria.tv/${response.poster.url}`)
            document.getElementById('releaseTitleEn').innerHTML=response.names.en
            document.getElementById('season').innerHTML=`Сезон: <span class="text-dark">${response.season.string} ${response.season.year}</span>`
            document.getElementById('type').innerHTML=`Тип: <span class="text-dark">${response.type.string} (${response.type.full_string})</span>`
            document.getElementById('genres').innerHTML=`Жанры: <span class="text-dark">${response.genres}</span>`
            document.getElementById('voice').innerHTML=`Озвучка: <span class="text-dark">${response.team.voice}</span>`
            document.getElementById('timings').innerHTML=`Тайминги: <span class="text-dark">${response.team.timing}</span>`
            document.getElementById('subs').innerHTML=`Субтитры: <span class="text-dark">${response.team.translator}</span>`
            document.getElementById('disc').innerHTML=`<span class="text-dark">${response.description}</span>`
            document.getElementById('oldLink').setAttribute('href', `https://www.anilibria.tv/release/${response.code}.html`)

            response.torrents.list.forEach(elem =>{

                var item = document.createElement('div')

                item.className=``
                item.innerHTML=`
                <div class="torrent p-2 mt-2 mb-2 d-flex justify-content-center align-items-center">
                    <span class="px-2">Серия ${elem.series.string} [${elem.quality.string}]</span>
                    <span class="vr"></span>
                    <span class="px-2"><i class="fas fa-file"></i> ${formatBytes(elem.total_size)}</span>
                    <span class="vr"></span>
                    <span class="px-2"><i class="fas fa-upload text-success"></i> ${elem.seeders}</span>
                    <span class="px-2"><i class="fas fa-download text-primary"></i> ${elem.leechers}</span>
                    <span class="vr"></span>
                    <span class="px-2"><i class="fas fa-file-download text-danger"></i> ${elem.downloads}</span>
                    <span class="vr"></span>
                    <span class="px-2"><i class="fas fa-calendar-plus"></i> ${timestampToDate(elem.uploaded_timestamp*1000)}</span>
                    <a class="btn btn-sm btn-outline-danger" href="https://www.anilibria.tv/${elem.url}">Скачать</a>
                </div>`
                elTorrents.appendChild(item)

            })

            var i = 1
            var b = response.player.series.last
            var list = new Array()

            for(i; i <= b; i++){
                list[i] = { "title":`Серия: ${response.player.playlist[i].serie}`, "file":`[720p]//${response.player.host}${response.player.playlist[i].hls.hd}, [480p]//${response.player.host}${response.player.playlist[i].hls.sd}`  }
            }
            list[0] = {};
            var player = new Playerjs({id:"player", file: list});

            //Debug
            //console.log(response)
            spinner.setAttribute('hidden', '')
            mainEl.removeAttribute('hidden')
        }
    })
}

function loadFilters(){
    var elFyear = document.getElementById('filterYear')
    var elGenre = document.getElementById('filterGenres')
    var elVoice = document.getElementById('filterVoice')
    var item;

    $.get({
        url: 'https://api.anilibria.tv/v2/getYears',
        success: function(response){
            response = response.reverse()
            response.forEach(elem =>{
                if(elem >= '2025'){
                    return;
                }
                item = document.createElement('li')
                item.innerHTML=`
                <a class="dropdown-item">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="${elem}" id="filterYear${elem}" name="filterYear">
                        <label class="form-check-label" for="filterYear${elem}">${elem}</label>
                    </div>
                </a>`
                
                
            })
            elFyear.appendChild(item)
        }
    });

    $.get({
        url: 'https://api.anilibria.tv/v2/getGenres',
        data: '',
        success: function(response){
            response.forEach(elem =>{

                item = document.createElement('li')
                item.innerHTML=`
                <a class="dropdown-item">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="${elem}" id="filterGenres${elem}" name="filterGenres">
                        <label class="form-check-label" for="filterGenres${elem}">${elem}</label>
                    </div>
                </a>`
                
                elGenre.appendChild(item)
            })
        },
    })

    $.get({
        url: 'https://api.anilibria.tv/v2/getTeam',
        data: '',
        success: function(response){
            response.team.voice.forEach(elem =>{

                item = document.createElement('li')
                item.innerHTML=`
                <a class="dropdown-item">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="${elem}" id="filterVoice${elem}" name="filterVoice">
                        <label class="form-check-label" for="filterVoice${elem}">${elem}</label>
                    </div>
                </a>`
                
                elVoice.appendChild(item)
            })
        },
    })
}


function loadBlog(){
    var i
    var elUpdates = document.getElementById('blog')
    $.get({
        url: 'https://api.anilibria.tv/v2/getYouTube',
        data: 'limit=-1',
        success: function(response){
            response = response.reverse()
            response = response.slice(0, 8)

            response.forEach(elem =>{
                var item = document.createElement('div')
                item.className=`col`
                item.innerHTML=`
                <a class="lastUpdateItem p-0 m-0" href="https://www.youtube.com/watch?v=${elem.id}">
                  <img src="${elem.image}" alt="" width="300" class="rounded-1 shadow">
                </a>`
                elUpdates.appendChild(item)
            })
        }
    })
}

function loadUpdates(){
    var elUpdates = document.getElementById('updates')
    $.get({
        url: 'https://api.anilibria.tv/v2/getUpdates',
        data: 'filter=names,code,id,updated,poster&limit=7',
        success: function(response){
            response.forEach(elem =>{
                var item = document.createElement('div')
                item.className=`col`
                item.innerHTML=`
                <a class="lastUpdateItem" href="./release#watch?r=${elem.id}">
                  <span class="position-absolute badge bg-light text-dark m-2">${new Date(elem.updated*1000).toLocaleTimeString("ru-RU")}</span>
                  <img src="https://static.anilibria.tv/${elem.poster.url}" alt="" width="150" class="rounded-1 shadow">
                </a>`
                elUpdates.appendChild(item)
            })
        }
    })
}

function loadCalendar(mainEl = 'pageCalendar'){
    var mainEl, opened = {}
    var el = document.getElementById('calendar')
    var days = [
        'Понедельник',
        'Вторник',
        'Среда',
        'Четверг',
        'Пятница',
        'Суббота',
        'Воскресенье',
    ]
    let date = new Date()
    date.getDay()

    $.get({
        url: 'https://api.anilibria.tv/v2/getSchedule',
        data: 'filter=poster,names,id,status,type,day,player,series',
        success: function(response){
            
            response.forEach(elem =>{

                var calendarItem = document.createElement('div')

                if(date.getDay() == elem.day+1){
                    opened.state = 'show'
                    opened.collapsed = ''
                    opened.bool = true
                    days[elem.day] = days[elem.day] +" [Сегодня]"
                }
                else{
                    opened.state = ''
                    opened.collapsed = 'collapsed'
                    opened.bool = false
                }

                calendarItem.className='accordion-item'
                calendarItem.innerHTML=`  
                <h2 class="accordion-header" id="heading${days[elem.day]}">
                  <button class="accordion-button ${opened.collapsed}" type="button" data-bs-toggle="collapse" data-bs-target="#day${elem.day}-collapse" aria-expanded="${opened.bool}" aria-controls="day${elem.day}-collapse">
                   ${days[elem.day]}
                  </button>
                </h2>

                <div id="day${elem.day}-collapse" class="accordion-collapse collapse ${opened.state}" aria-labelledby="heading${days[elem.day]}" data-bs-parent="#calendar">
                  <div class="accordion-body">
                      <div class="row row-cols-2 calendarItems"></div>
                  </div>
                </div>`
                elem.list.forEach(item =>{

                    var calendarSerial = document.createElement('div')
                    calendarSerial.className='col p-1'
                    calendarSerial.innerHTML=`
                    <a class="calendar" href="./release#watch?r=${item.id}">
                        <div class="calendar-img">
                            <img src="https://static.anilibria.tv/${item.poster.url}" alt="" class="rounded">
                        </div>
                        <div class="calendar-body">
                            <h5>${item.names.ru}</h5>
                            <h6>${item.names.en}</h6>
                            <span>Серий ${item.type.series}</span>
                        </div>
                    </a>`

                    calendarItem.querySelector('.calendarItems').appendChild(calendarSerial)

                })

                el.appendChild(calendarItem)
            })

        }
    })

}

function loadTeam(){

    $.get({

    })

}

function light(){
    var elem = document.getElementById('light')

    if(elem.getAttribute('hidden') == ''){
        elem.removeAttribute('hidden')
        setTimeout(function(){
            elem.style.opacity=1
        }, 10)
    }
    else{
        elem.style.opacity=0
        setTimeout(function(){
            elem.setAttribute('hidden', '')
        }, 500)
        
    }
}



function timestampToDate(ts) {
    var d = new Date();
    d.setTime(ts);
    return ('0' + d.getDate()).slice(-2) + '.' + ('0' + (d.getMonth() + 1)).slice(-2) + '.' + d.getFullYear();
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}


/**
 * Возвращает выбранные элементы в форме фильтров 
 * @param form Форма с фильтрами. По умолчанию form="filter"
 */
function getSelected(form = 'filter'){
    if(!form){ console.error('Element not defined'); return;}

    var out = new Object();
    var elem = document.querySelectorAll('form#'+form+' input[name]');

    elem.forEach(function(element, key){
        

        if(!out[element.name]){
            out[element.name] = new Array()
        }
        if(element.checked){
            out[element.name].push(element.value)
        }
        

    })

    if(Object.keys(out).length == 0){
        out = null;
    }
    return out
}

function getUrlSelected(selected = getSelected()){
    var selected;
    var type, filter = [], out;
    var types = {
        "filterYear": 'year', 
        "filterVoice": 'voice', 
        "filterGenres": 'genres', 
        "filterStatus": 'status', 
        "filterSeason": 'season_code', 
        "filterType": 'type'}

    if(selected){
        Object.keys(selected).forEach(element =>{
            if(Object.keys(selected[element]).length != 0){

                type = types[element]

                selected[element] = type + "=" + selected[element]
                filter.push(selected[element])
            } 
        })
    }
    if(filter.join('&')){
        out = "&" + filter.join('&')
    }
    else{
        out = ''
    }

    return out
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.hash.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
    vars[key] = value;
    });
    return vars;
}



// onscroll=function(){
//     var el = document.querySelector('.navbar')
//     var elLink = document.querySelectorAll('.nav-link')
//     if(window.pageYOffset >= 300){
        
//         el.style.backgroundColor = '#fff'
//         elLink.forEach(element =>{
//             element.style.color='#000'
//         })
//     }
//     else{
//         elLink.forEach(element =>{
//             element.style.color=''
//         })
        
//         el.style.backgroundColor = ''

//     }
// }

