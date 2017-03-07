#!/bin/bash

curl -F package=@releases/ndm_$(echo $1)_amd64.deb https://$2@push.fury.io/720kb/ && \
curl -F package=@releases/ndm_$(echo $1).rpm https://$2@push.fury.io/720kb/ && \

echo "Done."
