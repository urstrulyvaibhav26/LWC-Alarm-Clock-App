import { LightningElement } from 'lwc';
import AlarmClockAssets from '@salesforce/resourceUrl/AlarmClockAssets';
export default class AlarmClock extends LightningElement {
    clockImage = AlarmClockAssets+'/AlarmClockAssets/clock.png';
    alarmtone = new Audio(AlarmClockAssets+'/AlarmClockAssets/Clocksound.mp3');
    currentTime = '';
    hours = [];
    minutes = [];
    meridins = ['AM','PM'];
    alarTime;
    isAlarmSet = false;
    isAlarmTriggred = false;
    hourSelected;
    minuteSelected;
    meridinSelected;

    get isDropDownNotSelected(){
        return !(this.hourSelected && this.minuteSelected && this.meridinSelected);
    }

    get shakeImage(){
        return this.isAlarmTriggred ? 'shake' : '';
    }

    connectedCallback(){
        this.createMinutesOption();
        this.createHoursOption();
        this.currentTimeHandler();
    }

    currentTimeHandler(){

        setInterval(() =>{
            let date = new Date();
            let hour = date.getHours();
            let min = date.getMinutes();
            let sec = date.getSeconds();
            let ampm = "AM";
            if(hour == 0){
                hour = 12;
            }else if(hour>=12){
                hour = hour-12;
                ampm = "PM";
            }
            hour = hour<10 ? "0"+hour : hour;
            min = min<10 ? "0"+min : min;
            sec = sec<10 ? "0"+sec : sec;

            this.currentTime = `${hour}:${min}:${sec} ${ampm}`;
            if(this.alarTime === `${hour}:${min} ${ampm}`){
                //console.log("Alarm!!!");
                this.isAlarmTriggred = true;
                this.alarmtone.play();
                this.alarmtone.loop = true;
               // console.log(this.isAlarmTriggred);
            }
        }, 1000)

    }

    createHoursOption(){
        for(let i = 1; i<=12; i++){
            let val = i<10 ? "0"+i : i;
            this.hours.push(val);
        }
    }

    createMinutesOption(){
        for(let i = 0; i<=59 ; i++){
            let val = i<10 ? "0"+i : i;
            this.minutes.push(val);
        }
    }
    optionhandler(event){
        const{label,value} = event.detail;
        if(label=== "Hour(s)"){
            this.hourSelected = value;
        } else if(label==="Minute(s)"){
            this.minuteSelected = value;
        }else if(label==="AM/PM"){
            this.meridinSelected = value;
        }else{}
        console.log("this.hourselected", this.hourSelected);
        console.log("this.minuteselected", this.minuteSelected);
        console.log("this.meridinselected", this.meridinSelected);
    }

    setAlarmHandler(){
        this.alarTime = `${this.hourSelected}:${this.minuteSelected} ${this.meridinSelected}`;
        this.isAlarmSet = true;
    }
    cleartAlarmHandler(){
        this.alarTime = '';
        this.isAlarmSet = false;
        this.isAlarmTriggred = false;
        this.alarmtone.pause();
        const elements = this.template.querySelectorAll('c-clock-dropdown');
        Array.from(elements).forEach(element=>{
            element.reset("");
        })
    }
}