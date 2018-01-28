<?php

namespace repeat;

class geta {

    public static function getUser() {
        return ['stranger' => '*'];
    }
    public static function execute() {
        $q = "select id,first_step_id,count,next_repeat_id from repeat order by id asc";
        \db\init(DB_PATH_DATA);
        $data = \db\getDataAll($q);
        \db\suspend();
        return $data;
    }

}
