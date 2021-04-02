let nav = 0; //keep track of what month we are looking at
let clicked = null; //to click einai opoia mera exw clickarei
//tha prepei prwta na eimaste sigouroi oti uparxei sto localStorage prin to kanw parse
//to local kanei store mono strings opote prepei na kalesw to JSON.parse kai an einai undefined kai to kalesw tha bgalei error
//an den uparxei thelw aplws na epistrepsw ena empty array
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];
//Gia na mh xreiazetai na ta grafoume sunexeia mesa sta functions
const start = document.getElementById('startDate');
const end = document.getElementById('endDate');
const calendar = document.getElementById('calendar'); 
const newEventModal = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');
//to weekdays einai ena array gia na me boithisei na metraw posa padding days exw
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//NOTE!!! Ta months einai se array ara ksekinane apo to mhden

//pairnw ws argument to date giati molis to pathsei kai ftiaksei ena event prepei na kserw gia poio date einai to event
function openModal(date) {
    clicked = date;

    const eventForDay = events.find(e => e.date === clicked); //blepw an to modal exei hdh event na tou deiksw

    //Prepei na deiksw to modal KAI na settarw to text event gia to modal
    if (eventForDay) {
        document.getElementById('eventText').innerText = eventForDay.title; //setarw to event text
        deleteEventModal.style.display = 'block'; 
    } else { 
        newEventModal.style.display = 'block'; //to emfanizw giati sth css einai display none
    }

    backDrop.style.display = 'block';
}

function load() {
    const dt = new Date();
    //epeidh to dt tha einai panta iso me to current date kai emeis tha theloume na phgainoume se allous mhnes 
    //sto apo katw if checkarw an uparxei hdh kapoio nav 
    if (nav !== 0) {
        dt.setMonth(new Date().getMonth() + nav);  //kalw setMonth = current month kai bazw to nav , opote an pathsw next tha paei +1
    }
    //orizw const gia na pairnw ksexwrista o,ti xreiazomai gia thn hmeromhnia
    const day = dt.getDate();
    const month = dt.getMonth();
    const year = dt.getFullYear();

    

    //Thelw na parw kai thn prwth hmera tou mhna giati tha thn xrhsimopoihsoume gia na dhmiourghsoume ena date object
    //pou tha mas dinei ta padding days
    const firstDayOfMonth = new Date(year, month, 1);
    //To mhden stis meres pairnei thn teleutaia mera tou prohgoumenou mhna 
    //to oti bazw +1 ston month shmainei pws paw ston epomeno
    //p.x. an exw ianouario o mhnas tha mou dwsei febrouario , alla me to 0 sto day tha paw sthn teleutaia mera tou prohgoumenou mhna
    //me to getDate tha parw thn teleutaia mera tou ianouariou
    //Etsi tha mathw poses meres exei o mhnas gia na kserw posa square exw na kanw render
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    //prepei na kserw thn hmera pou briskomai gia paw mesa sto weekdays array kai na mathw posa padding days prepei na kanw render
    const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
        weekday: 'long', //dinei thn hmera olografws
        year: 'numeric',
        month: 'numeric', //p.x. anti gia ianouario tha mas dwsei 1
        day: 'numeric'
    });
    //gia to parakatw explanation kane console.log(dateString); kai des pws xwrizontai me ena komma kai ena keno
    //Bgazw to kommati weekday pou exw apo panw ektos giati thelw na pernaw mono to weekday epeidh panw sto array exoume weekdays
    const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);//to indexed value shmainei pws thelw to prwto meros pou einai to weekday

    //gemizw to monthDisplay me ton mhna pou currently exoume
    document.getElementById('monthDisplay').innerText =
        `${dt.toLocaleDateString('en-us', { month: 'long' })} ${year}`;
    //prepei na kanw reset to calendar kathe fora pou kalw thn load giati an den to kanw , mesa sthn for tha ftiaxnw allo ena calendar apo katw
    //kanw reset to prohgoumeno day square kai padding squeare kai to kanw pali render meta
    calendar.innerHTML = '';

    //Twra pou kserw posa paddingDays exw kai posa daysInMonth mporw na kanw loop mesa apo ola ta paddingDays kai ola ta daysInMonth
    //kai meta na kanw render ta paddingDays mazi me ta day squares sto calendar
    for (let i = 1; i <= paddingDays + daysInMonth; i++) {
        const daySquare = document.createElement('div');//gia kathe iteration tha ftiaxnw ena div pou tha onomazetai daySquare
        daySquare.classList.add('day'); //tou bazw kai to class day
        const dayString = `${month + 1}/${i - paddingDays}/${year}`;
        //Afou to iteration ksekinaei me 1 , an einai megalutero tou padding days tote kserw oti exw kanei iteration 
        //perissoteres fores apo ta paddingDays pou ontws uparxoun ara katalabainw oti prepei na kanw render ena daySquare anti gia paddingDays
        if (i > paddingDays) {      
            daySquare.innerText = i - paddingDays; //mas dinei ton arithmo pou xreiazetai gia to square pou einai mesa
            const eventForDay = events.find(e => e.date === dayString);

            //theloume sth shmerinh hmera na baloume ena class pou na thn ksexwrizei kai na fainetai h css
            if (i - paddingDays === day && nav === 0) {
                daySquare.id = 'currentDay';
            }

            if (eventForDay) {  //an uparxei event thelw na ftiaksw ena div mesa sto daySquare gia na fainetai
                const eventDiv = document.createElement('div');
                eventDiv.classList.add('event');
                eventDiv.innerText= eventForDay.title;
                daySquare.appendChild(eventDiv);// to kanw pass mesa sto daySquare
            }

            daySquare.addEventListener('click', () => openModal(dayString)); //sto openModal exw balei argument date 
        } else {
            daySquare.classList.add('padding'); //tou bazw to style apo to css pou tha exei shadow afou einai paddingDay
        }

        //prepei na parw to day square pou molis eftiaksa pou briskomai kai na to balw mesa sto calendar container
        calendar.appendChild(daySquare);
    }

}

//Self explained to parakatw
function closeModal() {
    eventTitleInput.classList.remove('error');// an kleisw to modal enw uparxei error thelw na kleisw kai to error
    newEventModal.style.display = 'none';
    deleteEventModal.style.display = 'none'; //otan to kleinw thelw na fugei kai to deleteEventModal
    backDrop.style.display = 'none';
    eventTitleInput.value = ''; //kathe fora pou kleinw h anoigw to modal thelw to prohgoumeno input text na exei fugei
    clicked = null; //theloume na katharisoume to clicked value
    load();
}

function saveEvent() {
    if (eventTitleInput.value) {//an o user exei grapsei mesa sto input mporw na to kanw save alliws de thelw na kanw to kanw save thelw na bgalw ena error
        eventTitleInput.classList.remove('error');
        //to kanw push sto array of events 
        events.push({
            date: clicked,
            title: eventTitleInput.value,
        });
        //afou to exw kanei push thelw na to kanw restore sto localStorage , DEN mporei na einai object alla mono string ara to kanw JSON.stringify
        localStorage.setItem('events', JSON.stringify(events)); //Bgazoume thn error class , bazw to new event sto event array kai to swzw sto local storage
        closeModal(); //molis kanei save thelw na kleinei to modal
    } else {
        eventTitleInput.classList.add('error');
    }
}

//Kanw ola ta event filter kai afhnw na perasoun mono osa den einai equal me clicked
function deleteEvent() {
    events = events.filter(e => e.date !== clicked);
    localStorage.setItem('events', JSON.stringify(events)); //to kanw reset kai sto localStorage
    closeModal(); //exei mesa to load de xreiazetai na to ksanagrapsw
}

//mesa sta button ftiaxnw event listeners pou tha kanoun increment h decrement to nav kai tha kaloun pali thn load meta
function initButtons() {
    document.getElementById('nextButton').addEventListener('click', () => {
        nav++; //increment nav 
        load();
    });

    document.getElementById('backButton').addEventListener('click', () => {
        nav--; //decrement nav 
        load();
    });

    document.getElementById('saveButton').addEventListener('click', saveEvent);
    document.getElementById('cancelButton').addEventListener('click', closeModal);
    document.getElementById('deleteButton').addEventListener('click', deleteEvent);
    document.getElementById('closeButton').addEventListener('click', closeModal);
}


initButtons();
load();

