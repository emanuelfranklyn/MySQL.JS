var Debug;

function GetTime() {
    var Time = GetTimeRaw();
    var SeparatedTime = Time.split(':');
    SeparatedTime.forEach((element, index) => {
        if (element.length < 2) {
            SeparatedTime[index] = `0${SeparatedTime[index]}`;
        }
    });
    return SeparatedTime.join(':');
}

function GetTimeRaw() {
    return `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`;
}

function ActiveDebug() {
    Debug = true;
    this.Debug = logger('Debug');
}

function Log(Gravity) {
    return function (Message) {
        let cutted = false;
        if (Message.toLocaleLowerCase().startsWith(Gravity.toLocaleLowerCase())) {
            var MessageStartIndex = Gravity.toLocaleLowerCase().length;
            Message = Message.substring(MessageStartIndex, Message.length).split(' ').join(' ');
            Message.startsWith(' ') ? Message = Message.substring(1) : false;
            cutted = true;
        }
        var Msg = cutted ? `[${GetTime()}] ${Gravity} ${Message}` : `[${GetTime()}] ${Gravity}: ${Message}`;
        console[Gravity.toLocaleLowerCase().toString()](Msg);
    };
}

function logger(Gravity) {
    if ((Gravity === 'Debug' && Debug) || Gravity !== 'Debug') {
        return Log(Gravity);
    } else {
        return () => {};
    }
}

module.exports = {
    ActiveDebug: ActiveDebug,
    Error: logger('Error'),
    Warn: logger('Warn'),
    Info: logger('Info'),
    Debug: logger('Debug'),
};
