#!/bin/bash

#####################################################################################
#
# embedcode.sh
# Tool to embed static web resources into PROGMEM constants
#
# Copyright (C) 2021 Michael Hammes
#
# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU Lesser General Public
# License as published by the Free Software Foundation; either
# version 3 of the License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
# Lesser General Public License for more details.
#
# You should have received a copy of the GNU Lesser General Public License
# along with this program; if not, write to the Free Software Foundation,
# Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
#
#####################################################################################

# Verify parameters
if [ "$1" == "" ] || [ "$2" == "" ] || [ "$3" == "" ]; then
	echo "embedcode.sh - Tool to embed static web resources into PROGMEM constants"
	echo "Usage: embedcode.sh <input> <constant name> <plain output> <gzip output>"
	echo "Recommendation: Remove existing comments beforehand using cpp -undef -P <input> <output>"
	exit 1
fi

# Set runtime variables
infile="$1"
constname="$2"
plainfile="$3"
compfile=""
if [ ! "$4" == "" ]; then compfile="$4"; fi

# Check files
if [ ! -f "$infile" ]; then echo "[embedcode] Input file not found: $infile"; exit 2; fi
if [ -f "$plainfile" ]; then
	rm "$plainfile"
	if [ $? -ne 0 ]; then echo "[embedcode] Plain output file exists and is not writable: $plainfile"; exit 3; fi
fi
if [ -f "$compfile" ]; then
	rm "$compfile"
	if [ $? -ne 0 ]; then echo "[embedcode] Compressed output file exists and is not writable: $compfile"; exit 4; fi
fi

# Generate plain file
printf "[embedcode] [$constname] $(basename "$infile") -> $(basename "$plainfile") Formatting ... "
plainresult=""
echo "const char ${constname}[] PROGMEM =" > "$plainfile"
while IFS= read -r line
do
	if [ ! "$line" == "" ]; then
		line=$(echo "$line" | sed --expression='s/"/'"'"'/g')
		line=$(echo "$line" | grep -Po "[^ \t]{1}.*")
		echo '"'"$line"'"' >> "$plainfile"
		if [ ! "$compfile" == "" ] && [ ! "$line" == "" ]; then plainresult="${plainresult}${line}"; fi
	fi
done < "$infile"
echo '"";' >> "$plainfile"
printf "Done.\n"

# Generate compressed file
if [ ! "$compfile" == "" ]; then
	printf "[embedcode] [$constname] $(basename "$infile") -> $(basename "$fout") Compressing ... "
	compressed=$(echo "$plainresult" | tr -d '\0' | gzip -cq | hexdump -ve '1/1 "\\x%.2x"')
	if [ $? -ne 0 ]; then printf "[embedcode] Failed to compress.\n"; exit 5; fi
	printf "Done.\n"

	sizecompressed=${#compressed}
	echo "[embedcode] [$constname] Plain size:      ${#plainresult}"
	echo "[embedcode] [$constname] Compressed size: $((sizecompressed / 2))"

	printf "[embedcode] [$constname] $(basename "$infile") -> $(basename "$fout") Formatting ... "
	echo "const size_t ${constname}_SIZE PROGMEM = $sizecompressed;" > "$compfile"
	echo "const char ${constname}[] PROGMEM = " >> "$compfile"
	for (( i=0; i<${#compressed}; i+=32 )); do
		if [ $((i+32)) -lt ${#compressed} ]; then echo '"'"${compressed:$i:32}"'"' >> "$compfile"; else echo '"'"${compressed:$i:32}"'";' >> "$compfile"; fi
	done
	printf "Done.\n"
fi

exit 0
