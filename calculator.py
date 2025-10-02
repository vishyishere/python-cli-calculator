#!/usr/bin/env python3
import argparse
import sys

def add(a,b): return a+b
def sub(a,b): return a-b
def mul(a,b): return a*b
def div(a,b):
    if b == 0:
        raise ZeroDivisionError("division by zero")
    return a/b

def main():
    parser = argparse.ArgumentParser(description="Tiny CLI calculator")
    parser.add_argument("op", choices=["add","sub","mul","div"])
    parser.add_argument("a", type=float)
    parser.add_argument("b", type=float)
    args = parser.parse_args()

    ops = {"add": add, "sub": sub, "mul": mul, "div": div}
    try:
        res = ops[args.op](args.a, args.b)
        if res == int(res):
            res = int(res)
        print(res)
    except Exception as e:
        print("Error:", e, file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
