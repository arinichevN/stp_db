function EditProg() {
    this.type = VISU_TYPE.TOP;
    this.container = {};
    this.data = [];
    this.data_ini = [];
    this.phone = [];
    this.initialized = false;
    this.controller_state = null;
    this.t1 = null;
    this.saveB = null;
    this.getB = null;
    this.helpB = null;
    this.bb = null;
    this.update = true;//editor will make it false
    this.last_sr = -1;
    this.last_sc = -1;
    this.del_block = false;//to deal with delete button and table click collision
    this.ROW = {
        ID: -1,
        DESCRIPTION: 0,
        FIRST_REPEAT_ID: 1
    };
    this.ACTION = {
        GET: 3,
        SAVE: 4,
        RESET: 5
    };
    this.ACTIVE_SIGN = "&check;";
    this.FLOAT_PRS = 3;
    this.ROW_SIZE = 50;
    this.visible = false;
    this.init = function () {
        try {
            var self = this;
            this.container = cvis();
            this.t1 = new Table(self, 1, trans, [
                [300, "40%"],
                [301, "40%"]
            ]);
            this.t1.m_style = "copy_cell";
            this.t1.cellClickControl([false, true]);
            this.t1.enable();
            this.saveB = cb("");
            this.getB = cb("");
            this.helpB = new NavigationButton(vhelp_prog, "f_js/image/help.png");
            this.saveB.onclick = function () {
                self.save();
            };
            this.getB.onclick = function () {
                self.getData();
            };
            this.bb = new BackButton();
            var rcont = cd();
            a(rcont, [this.getB, this.saveB, this.helpB, this.bb]);
            a(this.container, [this.t1, rcont]);
            cla([this.t1], ["w70m", "lg1"]);
            cla([rcont], ["w30m", "lg1"]);
            cla([this.saveB, this.getB, this.helpB, this.bb], ["h25m", "ug1", "f1"]);
            this.initialized = true;
        } catch (e) {
           alert("edit_prog: init: " + e.message);
        }
    };
    this.getName = function () {
        try {
            return trans.get(404);
        } catch (e) {
           alert("edit_prog: getName: " + e.message);
        }
    };
    this.updateStr = function () {
        try {
            this.t1.updateHeader();
            this.saveB.innerHTML = trans.get(1);
            this.getB.innerHTML = trans.get(57);
            this.helpB.updateStr();
            this.bb.updateStr();
        } catch (e) {
           alert("edit_prog: updateStr: " + e.message);
        }
    };
    this.cellChanged = function (id) {
        try {
            if (this.del_block) {
                this.del_block = false;
                return;
            }
            if (this.last_sc === this.t1.sc && this.last_sr === this.t1.sr) {
                switch (this.t1.sc) {
                    case this.ROW.DESCRIPTION:
                        var self = this;
                        vstring_edit_smp.prep(this.data[this.t1.sr].description, app.NAME_SIZE, self, this.t1.sc, 300);
                        showV(vstring_edit_smp);
                        break;
                    case this.ROW.FIRST_REPEAT_ID:
                        var self = this;
                        vint_edit.prep(this.data[this.t1.sr].first_repeat_id, 0, INT32_MAX, self, this.t1.sc, 301);
                        showV(vint_edit);
                        break;
                }
            }
            this.last_sc = this.t1.sc;
            this.last_sr = this.t1.sr;
        } catch (e) {
           alert("edit_prog: cellChanged: " + e.message);
        }
    };
    this.catchEdit = function (d, k) {
        try {
            switch (k) {
                case this.ROW.DESCRIPTION:
                    this.data[this.t1.sr].description = d;
                    this.t1.updateCell(this.t1.sr, this.t1.sc, this.data[this.t1.sr].description);
                    break;
                case this.ROW.FIRST_REPEAT_ID:
                    this.data[this.t1.sr].first_repeat_id = d;
                    this.t1.updateCell(this.t1.sr, this.t1.sc, this.data[this.t1.sr].first_repeat_id);
                    break;
                default:
                    console.log("prog: catchEdit: bad k");
                    break;
            }
        } catch (e) {
           alert("edit_prog: catchEdit: " + e.message);
        }
    };
    this.getData = function () {
        var data = [
            {
                action: ["program", "geta"]
            }
        ];
        cursor_blocker.enable();
        sendTo(this, data, this.ACTION.GET, "json_db");
    };
    this.resetContProg = function () {
        var arr = this.getChangedDataId();
        if (arr.length <= 0) {
            return;
        }
        var data = [
            {
                action: ["controller", "program", "reset"],
                param: arr
            }
        ];
        cursor_blocker.enable();
        sendTo(this, data, this.ACTION.RESET, "json_udp_acp");
    };
    this.dataRowChanged = function (i) {
        if (
                this.data[i].description !== this.data_ini[i].description || 
               this.data[i].first_repeat_id !== this.data_ini[i].first_repeat_id
                ) {
            return true;
        }
        return false;
    };
        this.dataRowChangedR = function (i) {
        if (
               this.data[i].first_repeat_id !== this.data_ini[i].first_repeat_id
                ) {
            return true;
        }
        return false;
    };
    this.getChangedDataId = function () {
        var arr = [];
        for (var i = 0; i < this.data.length; i++) {
             if (this.dataRowChangedR(i)) {
                arr.push(this.data[i].id);
            }
        }
        return arr;
    };
    this.getChangedData = function () {
        var arr = [];
        for (var i = 0; i < this.data.length; i++) {
             if (this.dataRowChanged(i)) {
                arr.push(this.data[i]);
            }
        }
        return arr;
    };
    this.dataIniToData = function () {
        for (var i = 0; i < this.data.length; i++) {
            for(var j in this.data[i]){
               this.data_ini[i][j] = this.data[i][j];
            }
        }
    };

    this.save = function () {
        var arr = this.getChangedData();
        if (arr.length <= 0) {
            return;
        }
        var data = [
            {
                action: ['program', 'save'],
                param: arr
            }
        ];
        cursor_blocker.enable();
        sendTo(this, data, this.ACTION.SAVE, "json_db");
    };
    this.confirm = function (action, d, n) {
        try {
            switch (action) {
                case this.ACTION.GET:
                    cleara(this.data);
                    cleara(this.data_ini);
                    var i = 0;
                    for (i = 0; i < d.length; i++) {
                        this.data.push({
                            id: parseInt(d[i].id),
                            description: d[i].description,
                            first_repeat_id: parseInt(d[i].first_repeat_id)
                        });
                        this.data_ini.push({
                            id: parseInt(d[i].id),
                            description: d[i].description,
                            first_repeat_id: parseInt(d[i].first_repeat_id)
                        });
                    }
                    this.redrawTbl();
                    cursor_blocker.disable();
                    break;
                case this.ACTION.SAVE:
                    this.dataIniToData();
                    cursor_blocker.disable();
                   //this.resetContProg();
                    break;
                case this.ACTION.RESET:
//                    this.dataIniToData();
//                    cursor_blocker.disable();
                    break;
                default:
                    console.log("confirm: unknown action: " + action);
                    break;
            }

        } catch (e) {
           alert("edit_prog: confirm: " + e.message);
        }

    };
    this.abort = function (action, m, n) {
        try {
            switch (action) {
                case this.ACTION.GET:
                    logger.err(250);
                    cursor_blocker.disable();
                    break;
                case this.ACTION.SAVE:
                    logger.err(257);
                    cursor_blocker.disable();
                    break;
                case this.ACTION.RESET:
                    logger.err(255);
                    cursor_blocker.disable();
                    break;
                default:
                    console.log("abort: unknown action: " + action);
                    break;
            }

        } catch (e) {
           alert("edit_prog: abort: " + e.message);
        }
    };
    this.getDataItem = function (k1, k2) {
        try {
            for (var i = 0; i < this.data.length; i++) {
                if (this.data[i].id === k1 && this.data[i].seq === k2) {
                    return  this.data[i];
                }
            }
            return null;
        } catch (e) {
           alert("edit_prog: getDataItem: " + e.message);
        }
    };
    this.redrawTbl = function () {
        try {
            this.last_sc = -1;
            this.last_sr = -1;
            this.t1.clear();
            for (var i = 0; i < this.data.length; i++) {
                this.t1.appendRow([
                    this.data[i].description,
                    this.data[i].first_repeat_id
                ]);
            }
        } catch (e) {
           alert("edit_prog: redrawTbl: " + e.message);
        }
    };
    this.show = function () {
        try {
            clr(this.container, "hdn");
            document.title =  vmenu_main.getName() + ": " + this.getName();
            if (this.update) {
                this.getData();
            }
            this.visible = true;
        } catch (e) {
           alert("edit_prog: show: " + e.message);
        }
    };
    this.hide = function () {
        try {
            cla(this.container, "hdn");
            this.visible = false;
        } catch (e) {
           alert("edit_prog: hide: " + e.message);
        }
    };
}
var vedit_prog = new EditProg();
visu.push(vedit_prog);