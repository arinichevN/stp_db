function EditRepeat() {
    this.type = VISU_TYPE.TOP;
    this.container = {};
    this.data = [];//[id, mark, value, status]
    this.initialized = false;
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
        FIRST_STEP_ID: 1,
        COUNT: 2,
        NEXT_REPEAT_ID: 3
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
            this.t1 = new Table(self, 1, trans, [[302, "20%"], [303, "20%"], [304, "20%"], [305, "20%"]]);
            this.t1.m_style = "copy_cell";
            this.t1.cellClickControl([false, true, true, true]);
            this.t1.enable();
            this.addB = cb("");
            this.delB = cb("");
            this.saveB = cb("");
            this.getB = cb("");
            this.helpB = new NavigationButton(vhelp_repeat, "f_js/image/help.png");
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
            cla([this.addB, this.delB, this.saveB, this.getB,this.helpB, this.bb], ["h15m", "ug1", "f1"]);
            this.initialized = true;
        } catch (e) {
            alert("edit_repeat: init: " + e.message);
        }
    };
    this.getName = function () {
        try {
            return trans.get(402);
        } catch (e) {
            alert("edit_repeat: getName: " + e.message);
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
            alert("edit_repeat: updateStr: " + e.message);
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
                    case this.ROW.FIRST_STEP_ID:
                        var self = this;
                        vint_edit.prep(this.data[this.t1.sr].first_step_id, 0, INT32_MAX, self, this.t1.sc, 303);
                        showV(vint_edit);
                        break;
                    case this.ROW.COUNT:
                        var self = this;
                        vint_edit.prep(this.data[this.t1.sr].count, 0, INT32_MAX, self, this.t1.sc, 304);
                        showV(vint_edit);
                        break;
                    case this.ROW.NEXT_REPEAT_ID:
                        var self = this;
                        vint_edit.prep(this.data[this.t1.sr].next_repeat_id, 0, INT32_MAX, self, this.t1.sc, 305);
                        showV(vint_edit);
                        break;
                }
            }
            this.last_sc = this.t1.sc;
            this.last_sr = this.t1.sr;
            this.btnCntDel();
            this.btnCntAdd();
        } catch (e) {
            alert("edit_repeat: cellChanged: " + e.message);
        }
    };
    this.catchEdit = function (d, k) {
        try {
            switch (k) {
                case this.ROW.ID:
                    this.data[this.t1.sr].id = d;
                    this.t1.updateCell(this.t1.sr, this.t1.sc, this.data[this.t1.sr].id);
                    break;
                case this.ROW.FIRST_STEP_ID:
                    this.data[this.t1.sr].first_step_id = d;
                    this.t1.updateCell(this.t1.sr, this.t1.sc, this.data[this.t1.sr].first_step_id);
                    break;
                case this.ROW.COUNT:
                    this.data[this.t1.sr].count = d;
                    this.t1.updateCell(this.t1.sr, this.t1.sc, this.data[this.t1.sr].count);
                    break;
                case this.ROW.NEXT_REPEAT_ID:
                    this.data[this.t1.sr].next_repeat_id = d;
                    this.t1.updateCell(this.t1.sr, this.t1.sc, this.data[this.t1.sr].next_repeat_id);
                    break;
                default:
                    console.log("main: catchEdit: bad k");
                    break;
            }
        } catch (e) {
            alert("edit_repeat: catchEdit: " + e.message);
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
            alert("edit_repeat: btnCntDel: " + e.message);
        }
    };
    this.btnCntAdd = function () {
        try {
            this.addB.disabled = false;
        } catch (e) {
            alert("edit_repeat: btnCntAdd: " + e.message);
        }
    };
    this.getNextDataId = function () {
        var max = 0;
        if (this.data.length) {
            max = this.data[0].id;
        }
        for (var i = 0; i < this.data.length; i++) {
            if (this.data[i].id > max) {
                max = this.data[i].id;
            }
        }
        return max + 1;
    };
    this.add = function () {
        try {
            var next_id = this.getNextDataId();
            this.data.push({id: next_id, first_step_id: -1, count: 1, next_repeat_id: -1});
            this.t1.appendRow([this.data[this.data.length - 1].id, this.data[this.data.length - 1].first_step_id, this.data[this.data.length - 1].count, this.data[this.data.length - 1].next_repeat_id]);
        } catch (e) {
            alert("edit_repeat: add: " + e.message);
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
            alert("edit_repeat: delete: " + e.message);
        }
    };
    this.getData = function () {
        var data = [
            {
                action: ["repeat", "geta"]
            }
        ];
        cursor_blocker.enable();
        sendTo(this, data, this.ACTION.GET, "json_db");
    };
    this.save = function () {
        var data = [
            {
                action: ['repeat', 'save'],
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
                            first_step_id: d[i].first_step_id,
                            count: d[i].count,
                            next_repeat_id: d[i].next_repeat_id
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
            alert("edit_repeat: confirm: " + e.message);
        }
    };
    this.abort = function (action, m, n) {
        console.log(m);
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
            alert("edit_repeat: abort: " + e.message);
        }
    };
    this.redrawTbl = function () {
        try {
            this.last_sc = -1;
            this.last_sr = -1;
            this.t1.clear();
            for (var i = 0; i < this.data.length; i++) {
                this.t1.appendRow([this.data[i].id, this.data[i].first_step_id, this.data[i].count, this.data[i].next_repeat_id]);
            }
            this.btnCntDel();
            this.btnCntAdd();
        } catch (e) {
            alert("edit_repeat: redrawTbl: " + e.message);
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
            alert("edit_repeat: show: " + e.message);
        }
    };
    this.hide = function () {
        try {
            cla(this.container, 'hdn');
            this.visible = false;
        } catch (e) {
            alert("edit_repeat: hide: " + e.message);
        }
    };
}
var vedit_repeat = new EditRepeat();
visu.push(vedit_repeat);
