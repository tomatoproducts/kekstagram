'use strict';

var template = document.querySelector('#picture-template').content;

var mockComments = [
'Всё отлично!',
'В целом всё неплохо. Но не всё.',
'Когда  вы  делаете  фотографию,  хорошо  бы  убирать  палец  из кадра. В конце концов это просто непрофессионально.',
'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var mockDescription = [
'Тестим новую камеру!',
'Затусили с друзьями на море',
'Как же круто тут кормят',
'Отдыхаем...',
'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
'Вот это тачка!'
];

var picturesBlock = document.querySelector('.pictures');
var bigPicture = document.querySelector('.gallery-overlay');


var quantityObjects = 25;
var minUrl = 1;
var maxUrl = 25;
var minLikes = 15;
var maxLikes = 200;


// Получаем фрагмент
var fragment = document.createDocumentFragment();

// Функция, возвращающая случайный элемент массива
var getRandomArrElement = function (arr) {
  var randomArrElement = Math.floor(Math.random() * arr.length);

  return randomArrElement;
};

// Функция, возвращающая случайное число
var getRandomInteger = function(min, max) {
  var randomInteger = min - 0.5 + Math.random() * (max - min + 1);
  randomInteger = Math.round(randomInteger);
  return randomInteger;
};


// Функция, генерирующая массив с определенным количеством js-объектов (картинок)
var getPhotos = function (quantityObjects) {
  var photos = [];

  for (var i = 0; i < quantityObjects; i++) {
    photos[i] = {
      url: 'photos/' + (i+1) + '.jpg',
      likes: getRandomInteger(minLikes, maxLikes),
      comments: mockComments[getRandomArrElement(mockComments)],
      description: mockDescription[getRandomArrElement(mockDescription)]
    };
  };

  return photos;
};

// Функция создания DOM-элемента(картинки) на основе js-объекта
var createPicture = function (object) {
  var element = template.cloneNode(true);

  element.querySelector('img').src = object.url;
  element.querySelector('.picture-comments').textContent = object.comments;
  element.querySelector('.picture-likes').textContent = object.likes;

  return element;
};

// Функция создания DOM-элемента(главной картинки) на основе js-объекта
var createBigPicture = function (evt) {
  var likes = evt.target.parentNode.querySelector('.picture-likes').textContent;

  bigPicture.querySelector('img').src = evt.target.src;
  bigPicture.querySelector('.likes-count').textContent = likes;
  bigPicture.querySelector('.comments-count').textContent = getRandomInteger(0, mockComments.length);

  return bigPicture;
};

// Функция, заполнения блока DOM-элементами на основе массива JS-объектов
var renderPictures = function (arr) {
  for (var i = 0; i < arr.length; i++) {
    fragment.appendChild(createPicture(arr[i]));
  };
  //Добавляем фрагмент c DOM-элементами в блок галереи
  picturesBlock.appendChild(fragment);
};

//Получаем массив с фотографиями
var photos = getPhotos(quantityObjects);

//Добавляем все фотографии на страницу
renderPictures(photos);

///////////////////////////////////////////**///////////////////////////////////////

var elementClose = bigPicture.querySelector('.gallery-overlay-close');
var ENTER_KEY_CODE = 13;
var ESC_KEY_CODE = 27;

//Закрыть окно по escape
var onEscPress = function (evt) {
  if(evt.keyCode === ESC_KEY_CODE) {
    bigPictureClose();
  };
};

//открыть окно
var bigPictureOpen = function (evt) {
  bigPicture.classList.remove('hidden');
  createBigPicture(evt);
  document.addEventListener('keydown', onEscPress);
};

//закрыть окно
var bigPictureClose = function () {
  bigPicture.classList.add('hidden');
  document.removeEventListener('keydown', onEscPress);
};

// Открытие и отрисовка главного фото по клику
picturesBlock.addEventListener('click', function(evt) {
  evt.preventDefault();
  bigPictureOpen(evt);

}, true);


//Закрытие по клику на крестик
elementClose.addEventListener('click', function() {
  bigPictureClose();
});

//закрыть окно по enter, когда крестик в фокусе
elementClose.addEventListener('keydown', function(evt) {
  if (evt.keyCode === ENTER_KEY_CODE) {
    bigPictureClose();
  };
});

//попробовать для обработки по энтеру
// // цикл двигается вверх от target к родителям до table
//   while (target != table) {
//     if (target.tagName == 'TD') {
//       // нашли элемент, который нас интересует!
//       highlight(target);
//       return;
//     }
//     target = target.parentNode;
//   }


////////////////////////////////////////**///////////////////////////////////////

var uploadBtn = document.querySelector('.upload-input');
var uploadOverlay = document.querySelector('.upload-overlay');
var uploadClose = uploadOverlay.querySelector('.upload-form-cancel');
var uploadSend = uploadOverlay.querySelector('.upload-form-submit');
var uploadCommentField = uploadOverlay.querySelector('.upload-form-description');

//Закрыть оверлей по escape
var onUploadEscPress = function (evt) {
  if (evt.keyCode === ESC_KEY_CODE) {
    uploadOverlayClose();
  };
};

//Открыть оверлей редактора фото
var uploadOverlayOpen = function () {
  uploadOverlay.classList.remove('hidden');
  document.addEventListener('keydown', onUploadEscPress);
};

//Закрыть оверлей редактора фото
var uploadOverlayClose = function () {
  uploadOverlay.classList.add('hidden');
  document.removeEventListener('keydown', onUploadEscPress);
  uploadBtn.value = '';
};

//Открыть форму редактирования фото при изменении значения поля загрузки файла
uploadBtn.addEventListener('change', function () {
  uploadOverlayOpen();
});

//Закрыть форму редактирования фото по клику на крестик
uploadClose.addEventListener('click', function () {
  uploadOverlayClose();
});

//Не закрывать форму по escape если фокус в поле комментария
uploadCommentField.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ESC_KEY_CODE) {
    evt.stopPropagation();
  }
});

//Отправить форму по нажатию на enter, если он в фокусе
uploadSend.addEventListener('keydown', function () {
  if (evt.keyCode === ENTER_KEY_CODE) {
    form.submit();
  }
});
//////////////////////////////////////////////////////**//////////////////////////////

var pin = uploadOverlay.querySelector('.scale__pin');

var minus = uploadOverlay.querySelector('.upload-resize-controls-button-dec');
var plus = uploadOverlay.querySelector('.upload-resize-controls-button-inc');
var sizeValue = uploadOverlay.querySelector('.upload-resize-controls-value');
var imgUpload = uploadOverlay.querySelector('.effect-image-preview');

//Масштаб по умолчанию 100%
imgUpload.style.transform = 'scale(1)';

var scale = parseInt(sizeValue.value) / 100;

//увеличить значение масштаба на 25 при каждом нажатии
var increaseSizeValue = function () {
  if (parseInt(sizeValue.value) <= 75 ) {
    sizeValue.value = parseInt(sizeValue.value) + 25 + '%';
    scale += 0.25;
    imgUpload.style.transform = 'scale(' + scale + ')';
  }
}

//уменьшить значение масштаба на 25 при каждом нажатии
var decreaseSizeValue = function () {
  if (parseInt(sizeValue.value) >= 50 ) {
    sizeValue.value = parseInt(sizeValue.value) - 25 + '%';
    scale -= 0.25;
    imgUpload.style.transform = 'scale(' + scale + ')';
  }
}


plus.addEventListener('click', increaseSizeValue);
minus.addEventListener('click', decreaseSizeValue);

////////////////////////////////////***////////////////////////////////////////////////////////
var fieldfilters = uploadOverlay.querySelector('.upload-effect-controls');

var filter = {
  original: 'effect-image-preview',
  chrome: 'effect-chrome',
  sepia: 'effect-sepia',
  marvin: 'effect-marvin',
  phobos: 'effect-phobos'
}

// var chooseFilter = function (evt) {
//   var target = evt.target;

//   // цикл двигается вверх от target к родителям до fieldfilters
//   while (target != fieldfilters) {
//     if (target.id == 'upload-effect-chrome') {
//       // нашли элемент, который нас интересует!
//       imgUpload.classList.add(filter.chrome);
//       return;
//     } else if (target.id == 'upload-effect-sepia') {
//       // нашли элемент, который нас интересует!
//       imgUpload.classList.add(filter.sepia);
//       return;
//     } else if (target.id == 'upload-effect-marvin') {
//       // нашли элемент, который нас интересует!
//       imgUpload.classList.add(filter.marvin);
//       return;
//     } else if (target.id == 'upload-effect-phobos') {
//       // нашли элемент, который нас интересует!
//       imgUpload.classList.add(filter.phobos);
//       return;
//     } else if (target.id == 'upload-effect-none') {
//       // нашли элемент, который нас интересует!
//       imgUpload.className(filter.original);
//       return;
//     }

//     target = target.parentNode;
//   }
// }

fieldfilters.addEventListener('click', function (evt) {
  chooseFilter(evt);
},true);


uploadOverlay.classList.remove('hidden');
