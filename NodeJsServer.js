var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var multer = require('multer');

const hostname = '127.0.0.1';
const port = 1111;
const directoryPath = 'storage';

const extensionsVideo = ['.avi', '.mkv', '.mp4'];
const extensionsAudio = ['.mp3', '.flac'];
const extensionsPhoto = ['.bmp', '.png', '.jpg', '.jpeg'];

var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
    callBack(null, directoryPath)},
    filename: (req, file, callBack) => {
        callBack(null, file.originalname)}
});

var upload = multer({storage: storage}).any();

function SendFileContent(response, fileName, contentType){
  fs.readFile(fileName, function(err, data){
    if(err){
      response.writeHead(404);
      response.write("File Not Found!");
    }
    else{
      response.writeHead(200, {'Content-Type': contentType});
      response.write(data);
    }
    response.end();
  });
}

function CreateCombineInfo(){
	return {
		SizeInBytes: 0,
		Count: 0,
		PercentCount: 0,
		PercentSizeInBytes: 0
	}
}

function ProcessFile(combineInfo, fileSize){
	combineInfo.SizeInBytes += fileSize;
	combineInfo.Count++;
}

function CalculatePercents(combineInfo, responseObject){
	combineInfo.PercentCount = combineInfo.Count / responseObject.TotalCount * 100;
	combineInfo.PercentSizeInBytes = combineInfo.SizeInBytes / responseObject.TotalSizeInBytes * 100;
}

function GetStorageInfo(request, response){
	var responseObject = {
		Video: CreateCombineInfo(),
		Audio: CreateCombineInfo(),
		Photo: CreateCombineInfo(),
		Other: CreateCombineInfo(),
		TotalSizeInBytes: 0,
		TotalCount: 0,
	};

	var items = fs.readdirSync(directoryPath);
	for (var i = 0; i < items.length; i++) {
		var filePath = directoryPath + '/' + items[i];
		var fileInfo = fs.statSync(filePath);
		var extension = path.extname(items[i]).toLowerCase();

		responseObject.TotalSizeInBytes += fileInfo['size'];
		responseObject.TotalCount++;

		if(extensionsVideo.indexOf(extension) >= 0){
			ProcessFile(responseObject.Video, fileInfo['size']);
		} else if(extensionsAudio.indexOf(extension) >= 0){
			ProcessFile(responseObject.Audio, fileInfo['size']);
		} else if(extensionsPhoto.indexOf(extension) >= 0){
			ProcessFile(responseObject.Photo, fileInfo['size']);
		} else{
			ProcessFile(responseObject.Other, fileInfo['size']);
		}
	}
	CalculatePercents(responseObject.Video, responseObject);
	CalculatePercents(responseObject.Audio, responseObject);
	CalculatePercents(responseObject.Photo, responseObject);
	CalculatePercents(responseObject.Other, responseObject);

	response.write(JSON.stringify(responseObject));
	response.end();
}

function UploadFile(request, response){
    upload(request, response, function (error){
        if(error){
            console.log(error);
            response.end('Error uploading file');
        } else {
            GetStorageInfo(request, response);
        }
    });

};

var server = http.createServer((request, response) => {
    var pathname = url.parse(request.url).pathname;
    switch (pathname.toLowerCase()) {
        case '/':
			response.writeHead(301,
			  {Location: 'index.html'}
			);
			response.end();
			break;
		case '/uploadfile':
            UploadFile(request, response);
			break;
		case '/getstorageinfo':
			GetStorageInfo(request, response);
			break;
        default:

			if(/^.*.html$/.test(request.url.toString())){
			   SendFileContent(response, __dirname + pathname, "text/html");
			} else if(/^.*.css$/.test(request.url.toString())){
			   SendFileContent(response, __dirname + pathname, "text/css");
			} else if(/^.*.js$/.test(request.url.toString())){
			   SendFileContent(response, __dirname + pathname, "application/javascript");
            } else if(/^.*.php$/.test(request.url.toString())){
                SendFileContent(response, __dirname + pathname, "text/php");
			} else if(/^.*.png$/.test(request.url.toString())){
                SendFileContent(response, __dirname + pathname, "image/png");
            } else if(/^.*.jpeg$/.test(request.url.toString())){
                SendFileContent(response, __dirname + pathname, "image/jpeg");
            } else if(/^.*.jpg$/.test(request.url.toString())){
                SendFileContent(response, __dirname + pathname, "image/jpeg");
            } else if(/^.*.svg$/.test(request.url.toString())){
                SendFileContent(response, __dirname + pathname, "image/svg+xml");
            } else if(/^.*.xls$/.test(request.url.toString())){
                SendFileContent(response, __dirname + pathname, "application/excel");
            } else if(/^.*.ttf$/.test(request.url.toString())){
                SendFileContent(response, __dirname + pathname, "font/ttf");
            } else if(/^.*.zip$/.test(request.url.toString())){
                SendFileContent(response, __dirname + pathname, "application/zip");
            }
			else{
				response.writeHead(404);
				response.write("Path Not Found!");
				response.end();
			}
            break;
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});