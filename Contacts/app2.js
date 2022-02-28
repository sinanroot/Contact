class Kisi{
    constructor(ad, soyad, mail){
        this.ad = ad;
        this.soyad = soyad;
        this.mail = mail;

    }
}

class Util{
    static bosAlanKontrolEt(...alanlar) {
        alanlar.forEach(alan => {
            let sonuc = true;
            if(alan.length === 0){
                sonuc = false;
                return false;
            }
        });

        return sonuc;


    }
    
    static emailGecerliMi(){
        const validateEmail = (email) => {
            return String(email)
              .toLowerCase()
              .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
              );
          };
    }
}

class Ekran{

    constructor(){
        this.ad = document.getElementById('ad');
        this.soyad = document.getElementById('soyad');
        this.mail = document.getElementById('mail');
        this.ekleGuncelleButon = document.querySelector('.kaydetGuncelle');
        this.form.addEventListener('submit', this.kaydetGuncelle.bind(this));
        this.form = document.getElementById('form-rehber');
        this.kisiListesi = document.querySelector('.kisi-listesi');
        this.kisiListesi.addEventListener('click', this.guncelleVeyaSil.bind(this));
        this.depo = new Depo();
        this.secilenSatir = undefined;
        this.kisileriEkranaYazdir();


    }

    alanlariTemizle(){
        this.ad.value = '';
        this.soyad.value = '';
        this.mail.value = '';

    }

    guncelleVeyaSil(e){
        const tiklanmaYeri = e.target;

        if (tiklanmaYeri.classList.contains('btn--delete')) {

            this.secilenSatir = tiklanmaYeri.parentElement.parentElement;
            this.kisiyiEkrandanSil();            
            
        }else if (tiklanmaYeri.classList.contains('btn--edit')) {
            this.secilenSatir = tiklanmaYeri.parentElement.parentElement;
            this.kisiyiEkrandaGuncelle();
            this.ekleGuncelleButon.value = 'Güncelle';
            this.ad.value.secilenSatir.cells[0].textContent;
            this.soyad.value.secilenSatir.cells[1].textContent;
            this.mail.value.secilenSatir.cells[2].textContent;
            
        }

    }

    bilgiOlustur(mesaj, durum){

   const uyariDvi = document.querySelector('.bilgi');

   uyariDvi.innerHTML = textContent = mesaj;
      

    uyariDvi.classList.add(durum ? 'bilgi--success' : 'bilgi--error');

    //setTimeOut, setInternal
    setTimeout(function () {
        
        uyariDvi.className = 'bilgi';


        },2000);

    }

    kisiyiEkrandaGuncelle(kisi){

        const sonuc = this.depo.kisiGuncelle(kisi, this.secilenSatir.cells[2].textContent);
        if(sonuc){

            this.secilenSatir.cells[0].textContent = kisi.ad;
            this.secilenSatir.cells[1].textContent = kisi.soyad;
            this.secilenSatir.cells[2].textContent = kisi.mail;
            
    
            
            this.alanlariTemizle();
            this.secilenSatir = undefined;
            this.ekleGuncelleButon.value = 'Kaydet';
            this.bilgiOlustur('Kisi Guncellendi!', true);


        }else {

            this.bilgiOlustur('Yazdıgınız mail kullanımda!');

        }

    }

    kisiyiEkrandanSil() {
        this.secilenSatir.remove();
        const silinecekMail = this.secilenSatir.cells[2].textContent;

        this.depo.kisiSil(silinecekMail);
        this.alanlariTemizle();
        this.secilenSatir = undefined;
        this.bilgiOlustur('Kisi Rehberden silindi', true);


    }

    kisileriEkranaYazdir() {

        this.depo.tumKisiler.forEach(kisi => {
            this.kisiyiEkranaEkle(kisi);
        });

    }


    kisiyiEkranaEkle(kisi){
        const olusturulanTr = document.createElement('tr');
        olusturulanTr.innerHTML = `<td>${kisi.ad}</td>
        <td>${kisi.soyad}</td>
        <td>${kisi.mail}</td>
        <td>
            <button class="btn btn--edit">
                <i class="fa-solid fa-pen-to-square"></i>
    
            </button>
            <button class="btn btn--delete">
                <i class="fa-solid fa-calendar-xmark"></i>
    
            </button>
        </td>`;

        this.kisiListesi.appendChild(olusturulanTr);


    }

    kaydetGuncelle(e){
        e.preventDefault();
        const kisi = new Kisi(this.ad.ariaValueMax, this.soyad.value, this.mail.value);
        const sonuc = Util.bosAlanKontrolEt(kisi.ad, kisi.soyad, kisi.mail);
        const emailGecerliMi = Util.emailGecerliMi(this.mail.value);
        
        
        //tum alanlar doldurulmus!
        if (sonuc) {

            if (!emailGecerliMi) {
                this.bilgiOlustur('Gecerli bir mail yazın!', false);
                return;
                
            }


            if (this.secilenSatir ) {

                this.kisiyiEkrandaGuncelle(kisi);
                
            }else {
                //yeni kisiyi ekrana ekler
                const sonuc = this.depo.kisiEkle(kisi);

                if (sonuc) {
                    this.bilgiOlustur('Basarıyla Eklendi!', true);
                    this.kisiyiEkranaEkle(kisi);
                    this.alanlariTemizle();
                    
                }else {
                    this.bilgiOlustur('Bu mail kullanımda!', false);

                }

            }
            
            this.alanlariTemizle();

        }else {// bazı alanlar bos!
            
            this.bilgiOlustur('Bos alanları doldurunuz!', false);

        }
   
    }   

}


class  Depo{
    //uygulama ilk açıldığında veriler getirilir!
    constructor(){
        this.tumKisiler = this.kisileriGetir();
    }

    emailEssizMi(mail){

       const sonuc = this.tumKisiler.find(kisi => {
            return kisi.mail === mail;
        });

        if (sonuc) {
            return false;
            
        }else {
            return true;

        }
            
            
    }
    
    kisileriGetir(){
        let tumKisilerLocal =[];
        if (localStorage.getItem('tumKisiler') === null) {
            tumKisilerLocal = [];
            
        }else {
            tumKisilerLocal = JSON.parse(localStorage.getItem('tumKisiler'));
        }
        return tumKisilerLocal;
    }

    kisiEkle(kisi){
        if (this.emailEssizMi(kisi.mail)) {

            this.tumKisiler.push(kisi);
            localStorage.setItem('tumKisiler', JSON.stringify(this.tumKisiler));
            return true;
        }else {
            return false;

        }
        
    
    }
    kisiSil(mail){
        this.tumKisiler.forEach((kisi, index) => {
            if (kisi.mail === mail) {
                this.tumKisiler.splice(index, 1);
                
            }
        });
        localStorage.setItem('tumKisiler', JSON.stringify(this.tumKisiler));

    }

    // guncellenmis kisi  : yeni degerler iiceriri, mail kisinin veritabanın bulunması için kisinin eski mailini içerir!
    kisiGuncelle(guncellenmisKisi, mail){

        if (guncellenmisKisi.mail === mail) {

            this.tumKisiler.forEach((kisi, index) => {
                if (kisi.mail === mail) {
                    
                    this.tumKisiler[index] = guncellenmisKisi;
                    localStorage.setItem('tumKisiler', JSON.stringify(this.tumKisiler));
                    return true;

                }
            });

            return true;

            
        }

        if (this.emailEssizMi(guncellenmisKisi, mail)) {
                console.log(guncellenmisKisi.mail + " için kokntrol yapılıyor ve sonuce : ");
                
                this.tumKisiler.forEach((kisi, index) => {
                    if (kisi.mail === mail) {
                        
                        this.tumKisiler[index] = guncellenmisKisi;
                        localStorage.setItem('tumKisiler', JSON.stringify(this.tumKisiler));
                        return true;

                    }
                });

                return true;
                

        }else {
            console.log(guncellenmisKisi.mail + " mail kullanımda!");
            return false;

        }

    }
    
}

document.addEventListener('DOMContentLoaded', function(e) {

    const ekran = new Ekran();

});






































