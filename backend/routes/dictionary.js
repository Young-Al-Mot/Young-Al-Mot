const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const request = require('request'); 

exports.dictionary = app.post('/dictionary', upload.single(), (req, res) => {
     //api 주소로 마지막 ko부분을 바꾸면 다른 언어로 호환 가능
    let link = "https://api.dictionaryapi.dev/api/v2/entries/ko/";
    let word = req.body.word;
    let result = false;
    
    //get방식으로 결과를 받고 2초이상 서버의 응답이 없을 경우 타임아웃 에러
    const options = {
        uri: link + word,
        method: "GET",
        timeout: 2000,
        followrRedirect: true,
        maxRedirects: 10,
      };
    
    
      request(options,function(err,response,resultset){
          //에러 발생시
        if(err != null)
        {
            return res.status(400).json({
                error: 6//api서버 연결불가
            })
        }

        //meanings가 없으면 단어가 없는 것이므로 meanings를 찾는다
        let wexist = resultset.indexOf('meanings');
        if(wexist != -1) {
            console.log("word is exist");
            result = true;
        }
        else {
            console.log("word is not exist");
            result = false;
        }
        
        res.json(
            {
                result,
                success:true
            }
        )
      })

      
  })
