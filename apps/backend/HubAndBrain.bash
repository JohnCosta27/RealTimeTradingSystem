#!/bin/bash

cd ./hub && go build && ./hub &
cd ./brain && go build && ./brain &
wait
