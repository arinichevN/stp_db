function EditStep() {
    this.type = VISU_TYPE.TOP;
    this.container = {};
    this.data = [];
    this.initialized = false;
        this.FLOAT_PRS = 3;
    this.t1 = null;
    this.addB = null;
    this.delB = null;
    this.saveB = null;
    this.getB = null;
    this.helpB = null;
    this.bb = null;
    this.update = true;//editor will make it false
    this.last_sr = -1;
    this.last_sc = -1;
    this.del_block = false;//to deal with delete button and table click collision
    this.ROW = {
        ID: 0,
        GOAL: 1,
        DURATION: 2,
        GOAL_CHANGE_MODE: 3,
        STOP_KIND: 4,
        NEXT_STEP_ID: 5
    };
    this.ACTION = {
        GET: 1,
        SAVE: 2
    };
    this.PHONE_SIZE = 12;
    this.visible = false;
    this.init = function () {
        try {
            var self = this;
            this.container = cvis();
            this.t1 = new Table(self, 1, trans, [[302, "10%"], [314, "17%"], [307, "17%"], [308, "17%"], [309, "17%"], [305, "10%"]]);
            this.t1.m_style = "copy_cell";
            this.t1.cellClickControl([false, true, true, true, true, true]);
            this.t1.enable();
            this.addB = cb("");
            this.delB = cb("");
            this.saveB = cb("");
            this.getB = cb("");
            this.helpB = new NavigationButton(vhelp_step, "f_js/image/help.png");
            this.bb = new BackButton();
            this.addB.onclick = function () {
                self.add();
            };
            this.delB.onclick = function () {
                self.delete();
            };
            this.saveB.onclick = function () {
                self.save();
            };
            this.getB.onclick = function () {
                self.getData();
            };
            var rcont = cd();
            a(rcont, [this.addB, this.delB, this.getB, this.saveB,this.helpB, this.bb]);
            a(this.container, [this.t1, rcont]);
            cla([this.t1], ["w70m", "lg1"]);
            cla([rcont], ["w30m", "lg1"]);
            cla([this.addB, this.delB, this.saveB, this.getB, this.helpB,this.bb], ["h15m", "ug1", "f1"]);
            this.initialized = true;
        } catch (e) {
            alert("edit_step: init: " + e.message);
        }
    };
    this.getName = function () {
        try {
            return trans.get(403);
        } catch (e) {
            alert("edit_step: getName: " + e.message);
        }
    };
    this.updateStr = function () {
        try {
            this.t1.updateHeader();
            this.addB.innerHTML = trans.get(50);
            this.delB.innerHTML = trans.get(51);
            this.saveB.innerHTML = trans.get(1);
            this.getB.innerHTML = trans.get(57);
            this.helpB.updateStr();
            this.bb.updateStr();
        } catch (e) {
            alert("edit_step: updateStr: " + e.message);
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
                    case this.ROW.ID:
                        var self = this;
                        vint_edit.prep(this.data[this.t1.sr].id, 0, INT32_MAX, self, this.t1.sc, 302);
                        showV(vint_edit);
                        break;
                    case this.ROW.GOAL:
                        var self = this;
                        vfloat_edit.prep(this.data[this.t1.sr].goal, -300.0, INT32_MAX, self, this.t1.sc, 314);
                        showV(vfloat_edit);
                        break;
                    case this.ROW.DURATION:
                        var self = this;
                        vtime_edit.prep(this.data[this.t1.sr].duration, 0, INT32_MAX, self, this.t1.sc, 307);
                        showV(vtime_edit);
                        break;
                    case this.ROW.GOAL_CHANGE_MODE:
                        if (this.data[this.t1.sr].goal_change_mode === "even") {
                            this.data[this.t1.sr].goal_change_mode = "instant";
                            this.t1.updateCell(this.t1.sr, this.t1.sc, this.typeToStr(this.data[this.t1.sr].goal_change_mode));
                        } else {
                            this.data[this.t1.sr].goal_change_mode = "even";
                            this.t1.updateCell(this.t1.sr, this.t1.sc, this.typeToStr(this.data[this.t1.sr].goal_change_mode));
                        }
                        break;
                    case this.ROW.STOP_KIND:
                        if (this.data[this.t1.sr].stop_kind === "time") {
                            this.data[this.t1.sr].stop_kind = "goal";
                            this.t1.updateCell(this.t1.sr, this.t1.sc, this.typeToStr(this.data[this.t1.sr].stop_kind));
                        } else {
                            this.data[this.t1.sr].stop_kind = "time";
                            this.t1.updateCell(this.t1.sr, this.t1.sc, this.typeToStr(this.data[this.t1.sr].stop_kind));
                        }
                        break;
                    case this.ROW.NEXT_STEP_ID:
                        var self = this;
                        vint_edit.prep(this.data[this.t1.sr].next_step_id, 0, INT32_MAX, self, this.t1.sc, 305);
                        showV(vint_edit);
                        break;
                }
            }
            this.last_sc = this.t1.sc;
            this.last_sr = this.t1.sr;
            this.btnCntDel();
            this.btnCntAdd();
        } catch (e) {
            alert("edit_step: cellChanged: " + e.message);
        }
    };
    this.catchEdit = function (d, k) {
        try {
            switch (k) {
                case this.ROW.ID:
                    this.data[this.t1.sr].id = d;
                    this.t1.updateCell(this.t1.sr, this.t1.sc, this.data[this.t1.sr].id);
                    break;
                case this.ROW.GOAL:
                    this.data[this.t1.sr].goal = d;
                    this.t1.updateCell(this.t1.sr, this.t1.sc, this.data[this.t1.sr].goal.toFixed(this.FLOAT_PRS));
                    break;
                case this.ROW.DURATION:
                    this.data[this.t1.sr].duration = d;
                    this.t1.updateCell(this.t1.sr, this.t1.sc, intToTimeStr(this.data[this.t1.sr].duration));
                    break;
                case this.ROW.NEXT_STEP_ID:
                    this.data[this.t1.sr].next_step_id = d;
                    this.t1.updateCell(this.t1.sr, this.t1.sc, this.data[this.t1.sr].next_step_id);
                    break;
                default:
                    console.log("main: catchEdit: bad k");
                    break;
            }
        } catch (e) {
            alert("edit_step: catchEdit: " + e.message);
        }
    };
    this.typeToStr = function (v) {
        if (v === "time") {
            return trans.get(315);
        } else if (v === "goal") {
            return trans.get(314);
        } else if (v === "even") {
            return trans.get(313);
        } else if (v === "instant") {
            return trans.get(312);
        }else{
            return "";
        }
    };
    this.btnCntDel = function () {
        try {
            if (this.data.length && this.t1.sr >= 0) {
                this.delB.disabled = false;
                return;
            }
            this.delB.disabled = true;
        } catch (e) {
            alert("edit_step: btnCntDel: " + e.message);
        }
    };
    this.btnCntAdd = function () {
        try {
            this.addB.disabled = false;
        } catch (e) {
            alert("edit_step: btnCntAdd: " + e.message);
        }
    };
    this.getNextDataId = function () {
        var max=0;
        if(this.data.length){
            max=this.data[0].id;
        }
        for(var i=0;i<this.data.length;i++){
            if(this.data[i].id>max){
                max=this.data[i].id;
            }
        }
        return max+1;
    };
    this.add = function () {
        try {
            var next_id = this.getNextDataId();
            this.data.push({id: next_id, goal: 0.0, duration: 1, goal_change_mode: 'instant', stop_kind: 'time', next_step_id: -1});
            this.t1.appendRow([this.data[this.data.length - 1].id, this.data[this.data.length - 1].goal.toFixed(this.FLOAT_PRS), intToTimeStr(this.data[this.data.length - 1].duration), this.typeToStr(this.data[this.data.length - 1].goal_change_mode), this.typeToStr(this.data[this.data.length - 1].stop_kind), this.data[this.data.length - 1].next_step_id]);
        } catch (e) {
            alert("edit_step: add: " + e.message);
        }
    };
    this.delete = function () {
        try {
            this.del_block = true;
            this.data.splice(this.t1.sr, 1);
            this.t1.deleteSelectedRow();
            this.btnCntDel();
            this.btnCntAdd();
        } catch (e) {
            alert("edit_step: delete: " + e.message);
        }
    };
    this.getData = function () {
        var data = [
            {
                action: ["step", "geta"]
            }
        ];
        cursor_blocker.enable();
        sendTo(this, data, this.ACTION.GET, "json_db");
    };
    this.save = function () {
        var data = [
            {
                action: ['step', 'save'],
                param: this.data
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
                    var i = 0;
                    for (i = 0; i < d.length; i++) {
                        this.data.push({
                            id: d[i].id,
                            goal: d[i].goal,
                            duration: d[i].duration,
                            goal_change_mode: d[i].goal_change_mode,
                            stop_kind: d[i].stop_kind,
                            next_step_id: d[i].next_step_id
                        });
                    }
                    this.redrawTbl();
                    break;
                case this.ACTION.SAVE:

                    break;
                default:
                    console.log("confirm: unknown action");
                    break;
            }
            cursor_blocker.disable();
        } catch (e) {
            alert("edit_step: confirm: " + e.message);
        }
    };
    this.abort = function (action, m, n) {
        try {
            switch (action) {
                case this.ACTION.GET:
                    logger.err(250);
                    break;
                case this.ACTION.SAVE:
                    logger.err(257);
                    break;
                default:
                    console.log("abort: unknown action");
                    break;
            }
            cursor_blocker.disable();
        } catch (e) {
            alert("edit_step: abort: " + e.message);
        }
    };
    this.redrawTbl = function () {
        try {
            this.last_sc = -1;
            this.last_sr = -1;
            this.t1.clear();
            for (var i = 0; i < this.data.length; i++) {
                this.t1.appendRow([
                    this.data[i].id, 
                    this.data[i].goal.toFixed(this.FLOAT_PRS),
                    intToTimeStr(this.data[i].duration), 
                    this.typeToStr(this.data[i].goal_change_mode), 
                    this.typeToStr(this.data[i].stop_kind), 
                    this.data[i].next_step_id]
                        );
            }
            this.btnCntDel();
            this.btnCntAdd();
        } catch (e) {
            alert("edit_step: redrawTbl: " + e.message);
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
            alert("edit_step: show: " + e.message);
        }
    };
    this.hide = function () {
        try {
            cla(this.container, 'hdn');
            this.visible = false;
        } catch (e) {
            alert("edit_step: hide: " + e.message);
        }
    };
}
var vedit_step = new EditStep();
visu.push(vedit_step);
