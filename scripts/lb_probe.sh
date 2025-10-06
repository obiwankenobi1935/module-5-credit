#!/usr/bin/env bash
# Usage: ./lb_probe.sh http://your-alb-dns
set -e
ALB="${1:?Provide ALB URL, e.g. http://my-alb-xyz.ap-southeast-2.elb.amazonaws.com}"
for i in {1..12}; do
  curl -s "$ALB/whoami"; echo
  sleep 0.5
done
