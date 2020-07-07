<%inherit file="../AstSubclass.java" />

<%block name="add_imports">
import com.rethinkdb.model.ReqlLambda;
import com.rethinkdb.ast.Util;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.Arrays;
import java.util.List;
</%block>

<%block name="member_vars">
    private static AtomicInteger varId = new AtomicInteger();
</%block>

<%block name="special_methods">\
    private static int nextVarId(){
        return varId.incrementAndGet();
    }
</%block>

<%block name="constructors">\
    protected Func(Arguments args){
        super(TermType.FUNC, args, null);
    }
</%block>
<%block name="static_factories">\
    public static Func fromLambda(ReqlLambda function) {
        if(function instanceof ReqlFunction0) {
            return new Func(Arguments.make(new MakeArray(Arrays.asList()),
                            Util.toReqlAst(((ReqlFunction0) function).apply())));
        }
        % for i in range(1, max_arity+1):
        else if(function instanceof ReqlFunction${i}){
            ReqlFunction${i} func${i} = (ReqlFunction${i}) function;
            % for j in range(1, i+1):
            int var${j} = nextVarId();
            % endfor
            List<Integer> varIds = Arrays.asList(
                ${", ".join("var%s"%(j,) for j in range(1, j+1))});
            Object appliedFunction = func${i}.apply(
                ${", ".join("new Var(var%s)"%(j,) for j in range(1, j+1))}
            );
            return new Func(Arguments.make(
                  new MakeArray(varIds),
                  Util.toReqlAst(appliedFunction)));
        }
        % endfor
        else {
            throw new ReqlDriverError("Arity of ReqlLambda not recognized!");
        }
    }
</%block>
