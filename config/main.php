<?php

//define('DB_CONNINFO_DATA', 'host=localhost port=5432 user=postgres password=654321 dbname=control');
define('DB_PATH_DATA', '/etc/controller/stp/data.db');

function f_getConfig() {
    return [
        'db' => [
            'use' => 'l'
        ],
        'acp' => [
            'use' => '1',
        ],
        'session' => [
            'use' => '4',
        ],
        'check' => [
            'use' => [1],
        ]
    ];
}
