# sls-fgen


## Requirements 

Pre-existing serverless.yml file.

## Usage

```
$ sls-fgen --funcName=hello --funcPath=handler.hello --method=get --httpPath=hello  --yamlPath=./serverless.yml
```

OR

```
$ sls-fgen -n hello -p handler.hello -m get -h hello -y ./serverless.yml
```
