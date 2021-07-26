# sls-fgen


## Requirements 

Pre-existing serverless.yml file.

## Usage

`➜ sls-fgen --yamlPath=./serverless.yml`

OR

`➜ sls-fgen -y ./serverless.yml`

| Argument    | Flag        | Description |
| ----------- | ----------- | ----------- |
| language    | l           | Abbreviation of programming language                          |
| template    | t           | Template of function |
| funcName    | n           | Name of the function that is going to be written to yaml file |
| funcPath    | p           | File name and function name |
| method      | m           | HTTP method |
| httpPath    | h           | HTTP path |
| yamlPath    | y           | Path of the yaml file |


### language


``` 
➜ sls-fgen --language=js

➜ sls-fgen -l js
``` 

#### Available languages by default

| Language    | Abbreviation (folder name)|
| ----------- | ----------- |
| JavaScript  | js          |
| TypeScript  | ts          |

See how to customize them.

### template 

```
➜ sls-fgen --template=default

➜ sls-fgen -t default
```

### funcName 

```
➜ sls-fgen --funcName=hello

➜ sls-fgen -n hello
```

### funcPath

File path + name of the function that is going to be written to the file.

```
➜ sls-fgen --funcPath=handler.hello

➜ sls-fgen -p handler.hello
```

If our language is JavaScript CLI is going to create handler.js file within a function named hello.

You can also specify a folder.

`➜ sls-fgen --funcPath=someFolder/handler.hello`


### method 

```
➜ sls-fgen --method=get

➜ sls-fgen -m get
```

| Available methods |
| ----------------- | 
| post 				|
| get  				|
| put  				|
| patch 			|
| delete 			|


### httpPath 

```
➜ sls-fgen --httpPath=user

➜ sls-fgen -n user
```

### yamlPath 

```
➜ sls-fgen --yamlPath=serverless.yml

➜ sls-fgen -y serverless.yml
```

## Customize

Open template file related to language. 

| Language    | Folder      |
| ----------- | ----------- |
| JavaScript  | js          |
| TypeScript  | ts          |

You can also add new languages by creating it's folder. Checkout **templates** folder.

```
➜ sls-fgen --edit=js

➜ sls-fgen -e js
```
