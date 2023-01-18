#!/bin/bash

ifconfig en0 | grep 10 | awk '{print $2}' 