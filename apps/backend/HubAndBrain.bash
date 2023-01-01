#!/bin/bash

cd ./hub && go build && ./hub &
cd ./brain && go run main &
wait
