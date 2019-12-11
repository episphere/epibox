console.log('epibox.js loaded')

epibox=async function(){
    console.log(`epibox ini at ${Date()}`)
    epibox.readParms()
    epibox.getOauth()
    epibox.login()
}

epibox.login=async function(){
    // look for token infoin localStorage
    if(localStorage.epiboxtoken){epibox.oauth.token=JSON.parse(localStorage.epiboxtoken)}
    if(epibox.parms.code){ // dance first step taken
        epibox.oauth.token = await (await fetch('https://api.box.com/oauth2/token',{
            method:"POST",
            body:`grant_type=authorization_code&code=${epibox.parms.code}&client_id=${epibox.oauth.client_id}&client_secret=${epibox.oauth.secret}`
        })).json()
    }
    if(!epibox.oauth.token){ // start dance
        location.href=`https://account.box.com/api/oauth2/authorize?client_id=${epibox.oauth.client_id}&response_type=code&redirect_uri=${location.origin+location.pathname}`
    }else{ // clean url code
        if(location.search.length>2){
            localStorage.epiboxtoken=JSON.stringify(epibox.oauth.token)
            location.href=location.origin+location.pathname
        }else{
            delete localStorage.epiboxtoken
            alert('logged in')
        }
    }
}

epibox.getOauth=function(uri=location.origin){
    //console.log(`oauth for ${location.origin}`)
    switch(uri){
        case 'http://localhost:8000':
            epibox.oauth={
                client_id:'52zad6jrv5v52mn1hfy1vsjtr9jn5o1w',
                secret:'2rHTqzJumz8s9bAjmKMV83WHX1ooN4kT'
            }
            break
        case 'https://episphere.github.io':
            epibox.oauth={
                client_id:'1n44fu5yu1l547f2n2fgcw7vhps7kvuw',
                secret:'2ZYzmHXGyzBcjZ9d1Ttsc1d258LiGGVd'
            }
            break
        default:
            Error(`no auth found for ${location.origin}`)
    }
}

epibox.readParms=function(str=location.hash+location.search){
    str=str.replace(/[\?\#]/g,'&').replace(/^\&/,'')
    //epibox.parms=JSON.parse(localStorage.epibox||'{}')
    epibox.parms={}
    str.split('&').forEach(aa=>{
        aa = aa.split('=')
        epibox.parms[aa[0]]=aa[1]
    })
    //localStorage.epibox=JSON.stringify(epibox.parms)
}