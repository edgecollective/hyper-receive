#!/bin/bash

docker run -it --rm --name hyper_receive --network host $USER/hyper_receive "$@"
