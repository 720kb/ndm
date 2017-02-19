#!/usr/bin/env bash

VERSION=$1

package_cloud push wouldgo/ndm/debian/buster releases/ndm_$(echo $VERSION)_amd64.deb && \
package_cloud push wouldgo/ndm/elementaryos/freya releases/ndm_$(echo $VERSION)_amd64.deb && \
package_cloud push wouldgo/ndm/ubuntu/trusty releases/ndm_$(echo $VERSION)_amd64.deb && \
package_cloud push wouldgo/ndm/ubuntu/utopic releases/ndm_$(echo $VERSION)_amd64.deb && \
package_cloud push wouldgo/ndm/ubuntu/vivid releases/ndm_$(echo $VERSION)_amd64.deb && \
package_cloud push wouldgo/ndm/ubuntu/wily releases/ndm_$(echo $VERSION)_amd64.deb && \
package_cloud push wouldgo/ndm/ubuntu/xenial releases/ndm_$(echo $VERSION)_amd64.deb && \
package_cloud push wouldgo/ndm/ubuntu/yakkety releases/ndm_$(echo $VERSION)_amd64.deb && \
package_cloud push wouldgo/ndm/linuxmint/serena releases/ndm_$(echo $VERSION)_amd64.deb && \
package_cloud push wouldgo/ndm/opensuse/42.1 releases/ndm-$(echo $VERSION).rpm && \
package_cloud push wouldgo/ndm/fedora/25 releases/ndm-$(echo $VERSION).rpm && \
package_cloud push wouldgo/ndm/el/7 releases/ndm-$(echo $VERSION).rpm && \

echo "Deployed!"
