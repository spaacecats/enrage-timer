# enrage-timer
TERA-proxy module that notifies you about enrage, 20 and 10s remaining time, telling you when the next natural enrage is going to be and shows total enrage time and percentage of last encounter.
## **Usage**
* **`!et party`** - enables enrage party notice **visible for all party members** (Use this option on your own risk)
* **`!et notice`** or **`!et n`** - enables enrage notice in party chat **visible only for you**
* **`!et private`** or **`!et p`** - enables notice in private chat channel
  * Private channel number can be specified **`!et p 5`** or **`!et private 3`** (1-8) otherwise its set to private chat 1
* **`!et name anyNameHere`** - allows you to change message sender name (**`E-T`** by default)
* **`!et state`** - returns system message letting you know about current set variables
* **`!et off`** - disables notice (disabled by default)

It's strongly recommended to only use this for private notices. (unless u are playing in EU, kappa)

All the chat notices but **`!et party`** are fully client-sided and only visible for you.
