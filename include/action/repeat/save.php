<?php

namespace repeat;

class save {

    public static function getUser() {
        return ['stranger' => '*'];
    }

    public static function execute($p) {
      $q = "delete from 'repeat'";
        \db\init(DB_PATH_DATA);
       \db\command($q);
        $r = true;
        foreach ($p as $v) {
            $q = "insert into 'repeat'(id,first_step_id,count,next_repeat_id) values ({$v['id']},{$v['first_step_id']},{$v['count']},{$v['next_repeat_id']})";
            $r = $r && \db\commandF($q);
        }
        if (!$r) {
            \db\suspend();
            throw new \Exception('some of inserts failed');
        }
        \db\suspend();
    }

}
