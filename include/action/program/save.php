<?php

namespace program;

class save {

    public static function getUser() {
        return ['stranger' => '*'];
    }

    public static function execute($p) {
        $r = true;
        \db\init(DB_PATH_DATA);
        foreach ($p as $v) {
            $q = "update prog set first_repeat_id={$v['first_repeat_id']} where id={$v['id']}";
            $r = $r && \db\commandF($q);
        }
        if (!$r) {
            \db\suspend();
            throw new \Exception('some of updates failed');
        }
        \db\suspend();
    }

}
