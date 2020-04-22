# wsu-cs1180 README

VSCode plugin for the cs 1180 in the Wright State CSE department

## Features

Contains capability to automatically create projects for Wright State's CS 1180 course.

## Requirements

A java SDK and JRE. These can be downloaded from [openjdk](https://adoptopenjdk.net/releases.html)

## Extension Settings

None

## Known Issues

- Projects are created in the current workspace directory. As a result, students could easily create a big long spaghetti mess of project nested inside project. Maybe some sort of "solution explorer" like in net beans/eclipse?
- The project template is hard coded into the extension code. If you want to change the template, you need to make an entirely new version, publish, and download it. Needless to say this is not ideal.

## Release Notes

### 0.0.3

Projects are created in their own named folders, allowing for a simple universal workspace, reducing eye-strain and bringing in better reception.

### 0.0.2

Add support for automatically creating projects.

### 0.0.1 

Initial release.
