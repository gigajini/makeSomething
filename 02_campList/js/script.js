const prevBtn = document.querySelector('#prevBtn');
const nextBtn = document.querySelector('#nextBtn');
const list = document.querySelector('#list');
const categoryBtns = document.querySelectorAll('#category button');
let pageNum = 1;
let keyword = null;
let isFiltering = false;
const mapPoint = [33.450701, 126.570667];

const campUrl = `https://apis.data.go.kr/B551011/GoCamping/basedList?numOfRows=10&pageNo=1&MobileOS=mobile&MobileApp=mobileApp&serviceKey=KE8fpP1J%2B89PviF5ypn1iC2Pt13cnUqW7zS6rTyC01AY5TnWK7Ke2zgCzNUU8TF3zQyZiEr6YfRfclI79xarRg%3D%3D&_type=json`;

//리스트 출력
function getData(url) {

    fetch(url)
            .then(response => {
                if (response.ok) return response.json();
                else throw new Error('서버오류 : ' + response.status);
            }).then(result => {

                console.log(result);
                console.log(result.response.body.totalCount);  //데이터 전체

                //페이지네이션
                nextBtn.addEventListener('click',() => {
                    pageNum++;
                    let campUrl = `https://apis.data.go.kr/B551011/GoCamping/basedList?numOfRows=10&pageNo=${pageNum}&MobileOS=mobile&MobileApp=mobileApp&serviceKey=KE8fpP1J%2B89PviF5ypn1iC2Pt13cnUqW7zS6rTyC01AY5TnWK7Ke2zgCzNUU8TF3zQyZiEr6YfRfclI79xarRg%3D%3D&_type=json`;
                    list.innerHTML = '';
                    return getData(campUrl);
                });        
                prevBtn.addEventListener('click',() => {       
                    if(pageNum == 0 ? pageNum == 0 : pageNum--);
                    let campUrl = `https://apis.data.go.kr/B551011/GoCamping/basedList?numOfRows=10&pageNo=${pageNum}&MobileOS=mobile&MobileApp=mobileApp&serviceKey=KE8fpP1J%2B89PviF5ypn1iC2Pt13cnUqW7zS6rTyC01AY5TnWK7Ke2zgCzNUU8TF3zQyZiEr6YfRfclI79xarRg%3D%3D&_type=json`;
                    list.innerHTML = '';
                    return getData(campUrl);
                });

                // 필터 활성화 여부 체크
                if(isFiltering){
                    list.innerHTML = '';
                    return filterList(result); 
                }else {
                    list.innerHTML = '';
                    return getList(result);  
                }

            }).catch(error => console.error('자료 가져오기 오류', error));

}

//기본 리스트
function getList(result) {

    let liObj = result.response.body.items.item;
    let liObjArr = [];
    let ul = '';

    for(let i = 0; i < liObj.length; i++){

        liObjArr.push(liObj[i]);

        let name = liObj[i].facltNm;
        let category = liObj[i].induty;
        let addr = liObj[i].addr1;
        let status = liObj[i].manageSttus;

        ul += `
            <ul class="item">
                <li>${name}</li>
                <li class="category">${category}</li>
                <li>${addr}</li>
                <li>${status}</li>
            </ul>
        `     
    }

    list.innerHTML = ul;

    let item = document.querySelectorAll('.item');
    let category = document.querySelectorAll('.category');

    //좌표값 반환
    item.forEach((el,index) => {
        el.addEventListener('click',function() {

            item.forEach((list) => {
                list.classList.remove('active');
            })

            el.classList.add('active');
            getMapPoint(index,liObjArr);
            viewMap();
        })
    })

    //카테고리 별 스타일 지정
    category.forEach((el)=>{

        const nameArr = el.innerText.split(',');
        let newText = '';
        for(let name of nameArr){
            if(name == '일반야영장'){
                newText += '<span class="campsite">일반야영장</span>';
            }else if(name == '글램핑'){
                newText += '<span class="glamping">글램핑</span>';
            }else if(name == '카라반'){
                newText += '<span class="caravan">카라반</span>';
            }else if(name == '자동차야영장'){
                newText += '<span class="carCamp">자동차야영장</span>';
            }
        }
        el.innerHTML = newText;
    })
}

//필터 리스트
function filterList(result) {
    let resultArr = result.response.body.items.item;
    let itemArr = [];
    let ul = '';

    // 카테고리에 맞는 객체를 배열에 저장
    resultArr.forEach((listItem) => {

        if(keyword != '전체') {
            if(listItem.induty === keyword){
               itemArr.push(listItem);
            }
        }else {
            itemArr.push(listItem);
        }          
    });

    //배열에 저장된 객체를 화면에 뿌려줌
    for(let i = 0; i < itemArr.length; i++){
        let name = itemArr[i].facltNm;
        let category = itemArr[i].induty;
        let addr = itemArr[i].addr1;
        let status = itemArr[i].manageSttus;

        ul += `
            <ul class="item">
                <li>${name}</li>
                <li class="category">${category}</li>
                <li>${addr}</li>
                <li>${status}</li>
            </ul>
        `   
    }

    list.innerHTML = ul;

    let item = document.querySelectorAll('.item');
    let category = document.querySelectorAll('.category');

    //좌표값 반환
    item.forEach((el,index) => {
        el.addEventListener('click',function() {

            item.forEach((list) => {
                list.classList.remove('active');
            })

            el.classList.add('active');
            getMapPoint(index,itemArr);
            viewMap();
        })
    })

    //카테고리 별 스타일 지정
    category.forEach((el)=>{

        const nameArr = el.innerText.split(',');
        let newText = '';
        for(let name of nameArr){
            if(name == '일반야영장'){
                newText += '<span class="campsite">일반야영장</span>';
            }else if(name == '글램핑'){
                newText += '<span class="glamping">글램핑</span>';
            }else if(name == '카라반'){
                newText += '<span class="caravan">카라반</span>';
            }else if(name == '자동차야영장'){
                newText += '<span class="carCamp">자동차야영장</span>';
            }
        }
        el.innerHTML = newText;
    })
}

//카테고리 선택출력
categoryBtns.forEach((button) => {
    
    button.addEventListener('click',(e) => {
        keyword = e.target.innerText;

        if(keyword != '전체'){
            isFiltering = true;
        }else {
            isFiltering = false;
        }
        getData(campUrl);
    })
})

//지도 좌표 보내기 (getList,filterList 함수 내부에서 실행되어야 함)
function getMapPoint(index,arr) {

    // 클릭한 리스트아이템이 가지는 인덱스와 같은 인덱스의 listArr 요소의 지도 좌표를 반환
    let pointX = arr[index].mapX;
    let pointY = arr[index].mapY;

    mapPoint[0] = Number(pointX);
    mapPoint[1] = Number(pointY);

}

//지도생성
function viewMap() {

    let mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = { 
        center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };
    
    // 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
    let map = new kakao.maps.Map(mapContainer, mapOption); 
    
    function panTo() {
        // 이동할 위도 경도 위치를 생성합니다 
        var moveLatLon = new kakao.maps.LatLng(mapPoint[1],mapPoint[0]);
        
        // 지도 중심을 부드럽게 이동시킵니다
        // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
        map.panTo(moveLatLon);            
    }
    
    // 마커가 표시될 위치입니다 
    var markerPosition  = new kakao.maps.LatLng(mapPoint[1],mapPoint[0]); 
    
    // 마커를 생성합니다
    var marker = new kakao.maps.Marker({
        position: markerPosition
    });
    
    // 마커가 지도 위에 표시되도록 설정합니다
    marker.setMap(map);
    panTo();
}

//초기 데이터 가져오기
window.addEventListener('DOMContentLoaded',() => {
    getData(campUrl);
})



/*
 문제점 정리
 1. 필터 선택 후 페이지네이션이 상당히 버벅거림
 2. 필터 선택 후 페이지네이션 진행 시 원래 표출되어야 할 아이템 갯수 (10개)에 맞지 않게 생성. 심지어 안뜨는 경우도 있음.
*/






