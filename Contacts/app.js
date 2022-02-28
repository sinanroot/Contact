
const ad = document.getElementById('ad');
const soyad = document.getElementById('soyad');
const mail = document.getElementById('mail');

const form = document.getElementById('form-rehber');
const kisiListesi = document.querySelector('.kisi-listesi');


//event listenerların tanımlanması
form.addEventListener('submit', kaydet);
kisiListesi.addEventListener('click', kisiIslemleriniYap);

//tüm kisiler için dizi

const tumKisilerDizisi = [];
let secilenSatir = undefined;


function kisiIslemleriniYap(event) {

    if (event.target.classList.contains === 'btn--delete') {
        const silinecekTr = event.target.parentElement.parentElement;
        const silinecekMail = event.target.parentElement.previousElementSibling.textContent;

        
        rehberdenSil(silinecekTr, silinecekMail);
        
    }else if (event.target.classList.contains('btn--edit')) {
        document.querySelector('.kaydetGuncelle').value = 'Güncelle';
        const secilenTr = event.target.parentElement.parentElement;
        const guncellenecekMail = secilenTr.cells[2].textContent;

        ad.value = secilenTr.cells[0].textContent;
        soyad.value = secilenTr.cells[1].textContent;
        mail.value = secilenTr.cells[2].textContent;

        secilenSatir = secilenTr;
                
    }

}

function kisiSil(silinecekTrElement, silinecekMail){

    silinecekTrElement.remove();


    //maile göre silme islemi
    // tumKisilerDizisi.forEach((kisi, index) => {
    //     if (kisi.mail === silinecekMail) {
            
    //         tumKisilerDizisi.splice(index, 1);


            
    //     }
    // });

    const silinmeyecekKisiler = tumKisilerDizisi.filter(function(kisi, index) {
            return kisi.mail != silinecekMail;


        });

        tumKisilerDizisi.length = 0;
        tumKisilerDizisi.push(...silinmeyecekKisiler);        
        
        alanlariTemizle();
        document.querySelector('kaydetGuncelle').value = 'Kaydet';



}


function kaydet(e) {
    e.preventDefault();

    const ekleneceVeyaGuncellenecekkKisi = {
        ad: ad.value,
        soyad: soyad.value,
        mail: mail.value

    }

 const sonuc =   verileriKontrolEt(ekleneceVeyaGuncellenecekkKisi);



        if (sonuc.durum) {
            if (secilenSatir) {
                //guncelleme yap
                kisiyiGuncelle(ekleneceVeyaGuncellenecekkKisi);


                
            }else {

            kisiyiEkle(ekleneceVeyaGuncellenecekkKisi);

            }
            
        }else {
            bilgiOlustur(sonuc.mesaj, sonuc.durum);

        }


  //  console.log(eklenecekKisi);
    
}
function kisiyiGuncelle(kisi){

    //kisi parametresinde secilen kisinin yeni degerleri vardır!
    //secilen satırda eski degerler var!

    for (let i = 0; i < tumKisilerDizisi.length; i++) {
        if(tumKisilerDizisi[i].mail === secilenSatir.cells[2].textContent){
            tumKisilerDizisi[i] = kisi;
            break;

        }
        
    }

    secilenSatir.cell[0].textContent = kisi.ad;
    secilenSatir.cell[1].textContent = kisi.soyad;
    secilenSatir.cell[2].textContent = kisi.mail;


    document.querySelector('.kaydetGuncelle').value = 'Kaydet';
    secilenSatir = undefined;
    
}

function kisiyiEkle (eklenecekKisi) {

    const olusuturlanTrElementi = document.createElement('tr');
    olusuturlanTrElementi.innerHTML = 
    `<td>${eklenecekKisi.ad}</td>
    <td>${eklenecekKisi.soyad}</td>
    <td>${eklenecekKisi.mail}</td>
    <td>
        <button class="btn btn--edit">
            <i class="fa-solid fa-pen-to-square"></i>

        </button>
        <button class="btn btn--delete">
            <i class="fa-solid fa-calendar-xmark"></i>

        </button>
    </td>`;

    kisiListesi.appendChild(olusuturlanTrElementi);

    tumKisilerDizisi.push(eklenecekKisi);
    bilgiOlustur('Kişi rehbere eklendi!', true);



}

function verileriKontrolEt(kisi) {  

    //objelerde in kullanımı
    for(const deger in kisi){
        if(kisi[deger].length){
    
            console.log(kisi[deger]);

        }else {

            const sonuc = {
                durum: false,
                mesaj: 'Boş alan bırakmayınız!'
            }
            return sonuc;
            
        }
    }
    alanlariTemizle();
    return {
        durum: true,
        mesaj: 'Kaydedildi!'
    }



}


function bilgiOlustur(mesaj, durum) {


    const olusturulanBilgi = document.createElement('div');
    olusturulanBilgi.textContent = mesaj;
    olusturulanBilgi.className = 'bilgi';
    // if (durum) {
    //     olusturulanBilgi.classList.add('bilgi--success');
        
    // }else {
    //     olusturulanBilgi.classList.add('bilgi--error');
    // }

    olusturulanBilgi.classList.add(durum ? 'bilgi--success' : 'bilgi--error'); 
    document.querySelector('.container').insertBefore(olusturulanBilgi, form);

    //setTimeOut, setInternal
    setTimeout(function () {
        
        const silinecekDiv = document.querySelector('.bilgi');

        if (silinecekDiv) {
            silinecekDiv.remove();
            
        }



    },2000);

}


function alanlariTemizle () {

    ad.value = '';
    soyad.value = '';
    mail.value = '';

}


















