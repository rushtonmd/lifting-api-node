Lifting-API using Node.js
================

## Usage

### Users

http://(hostname)/api/users 

[POST] http://(hostname)/api/users/new

http://(hostname)/api/users/:username

### Workouts

http://(hostname)/api/users/:username/workouts

### Liftnames

http://(hostname)/api/users/:username/liftnames

[POST] http://(hostname)/api/users/:username/liftnames/new

http://(hostname)/api/users/:username/liftnames/:liftnameid

[DEL] http://(hostname)/api/users/:username/liftnames/:liftnameid

### Muscle Groups

http://(hostname)/api/users/:username/musclegroups

### Lifts

http://(hostname)/api/users/:username/lifts

[POST] http://(hostname)/api/users/:username/lifts/new

http://(hostname)/api/users/:username/lifts/:liftid

[DEL] http://(hostname)/api/users/:username/lifts/:liftid

