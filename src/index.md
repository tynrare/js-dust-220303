# dust ▮

- [03.03](dust-220303/index.pug)


# dump 👒

- [README.md](../README.md)

# dump-0

## r0

Указываю на файл через `#`[линк](#dust.md).
Должно открыть `dust.md` где-то ниже:

---
... тут

---

## r1

``` js
{
	content: {},
	types: {},
	meta: {}
}
```

Если key в content определен и в types, то по нему (типу) можно обрабатывать отдаваемое значение.

...

``` js 
content.formula = 'sin(1)'
types.formula = ':mathjs'
```

.. Например говорит обработать formula через mathjs
