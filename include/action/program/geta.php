<?php

namespace program;

class geta {

    public static function getUser() {
        return ['stranger' => '*'];
    }
    public static function execute() {
        $q = "select id,description,first_repeat_id from prog order by id asc";
        \db\init(DB_PATH_DATA);
        $data = \db\getDataAll($q);
        \db\suspend();
        return $data;
    }

}
