# Makefile creted by Connor Christensen

# This file contains four options:
# 	make            - run the default task
#   make clean      - remove all the intermeiate build files for latex
#   make clean-hard - remove all intermeiate files and the pdf
#   make build		- builds without cleaning the intermeiate files

# this is the name of the .tex file
TARGET=writeup

# the default behavior is to compile a latex document
# it requires that the .tex file exists first
default: $(TARGET).tex
	make build

# clean removes lots of documents that are used in the intermediate build process
clean:
	rm -f $(TARGET).aux
	rm -f $(TARGET).dvi
	rm -f $(TARGET).log
	rm -f $(TARGET).out
	rm -f $(TARGET).ps
	rm -f $(TARGET).bbl
	rm -f $(TARGET).blg
	rm -f $(TARGET).fdb_latexmk
	rm -f $(TARGET).fls
	rm -f $(TARGET).synctex.gz

clean-hard:
	make clean
	rm -f $(TARGET).pdf
	rm -f $(TARGET).toc

# build it several times to build all our dependencies and then build the
# final product with our dependencies included in the finished version
build: $(TARGET).tex

	# main document structure
	pdflatex $(TARGET).tex

	# make the bibtec document if you need it
	# bibtex $(TARGET)

	# make the table of contents
	pdflatex $(TARGET).tex

	# include all the intermediate files
	pdflatex $(TARGET).tex
