namespace budget_tracker_client.Models;

public readonly struct Result<T, TE> {
    private readonly bool _success;
    public readonly T Value;
    public readonly TE Error;

    private Result(T v, TE e, bool success)
    {
        Value = v;
        Error = e;
        _success = success;
    }

    public static Result<T, TE> Ok(T v)
    {
        return new(v, default(TE), true);
    }

    public static Result<T, TE> Err(TE e)
    {
        return new(default(T), e, false);
    }

    public static implicit operator Result<T, TE>(T v) => new(v, default(TE), true);
    public static implicit operator Result<T, TE>(TE e) => new(default(T), e, false);

    public TR Match<TR>(
        Func<T, TR> success,
        Func<TE, TR> failure) =>
        _success ? success(Value) : failure(Error);
}