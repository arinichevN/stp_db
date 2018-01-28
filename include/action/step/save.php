<?php

namespace step;

class save {

    public static function getUser() {
        return ['stranger' => '*'];
    }

    public static function execute($p) {
        $q = "delete from step";
        \db\init(DB_PATH_DATA);
        \db\command($q);
        $r = true;
        foreach ($p as $v) {
            $q = "insert into step(id,goal,duration,goal_change_mode,stop_kind,next_step_id) values ({$v['id']},{$v['goal']},{$v['duration']},'{$v['goal_change_mode']}','{$v['stop_kind']}',{$v['next_step_id']})";
            $r = $r && \db\commandF($q);
        }
        if (!$r) {
            \db\suspend();
            throw new \Exception('some of inserts failed');
        }
        \db\suspend();
    }

}
