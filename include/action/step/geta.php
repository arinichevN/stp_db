<?php

namespace step;

class geta {

    public static function getUser() {
        return ['stranger' => '*'];
    }
    public static function execute() {
        $q = "select id,goal,duration,goal_change_mode,stop_kind,next_step_id from step order by id asc";
        \db\init(DB_PATH_DATA);
        $data = \db\getDataAll($q);
        \db\suspend();
        return $data;
    }

}
