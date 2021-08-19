function search(){
    var resultOut = document.getElementById('navSearchResult')
    resultOut.innerHTML=''
    if(document.getElementById('navSearch').value != ""){
        $.get({
            url: 'http://api.anilibria.tv/v2/searchTitles',
            data: `search=${document.getElementById('navSearch').value}&limit=10&filter=names`,
            success: function(response){
                resultOut.innerHTML=''
                var resultItem
                

                response.forEach(element => {
                    resultItem = document.createElement('li')
                    resultItem.innerHTML=`<a class="dropdown-item" href="#">${element.names.ru}</a>`
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

