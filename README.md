# Project Title

Test  [google-trends-api](https://www.npmjs.com/package/google-trends-api)
# Notes

The text of a column in csv file must be wrapped in quote character so that it will be loaded correctly. For example, in input keywords csv file, we have 2 following cases of writing a :keyword
* warp inside quote character [**CORRECT**]
```
"audi, ltc"
```
=> loaded as "audi, ltc" when running
* NOT warp inside quote character [**INCORRECT**]
```
audi, ltc
```
=> loaded as "audi" when running
