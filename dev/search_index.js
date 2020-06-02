var documenterSearchIndex = {"docs":
[{"location":"examples/fit_map/#","page":"Maximum a Posteriori","title":"Maximum a Posteriori","text":"EditURL = \"https://github.com/maxmouchet/HMMBase.jl/blob/master/examples/fit_map.jl\"","category":"page"},{"location":"examples/fit_map/#Maximum-a-Posteriori-1","page":"Maximum a Posteriori","title":"Maximum a Posteriori","text":"","category":"section"},{"location":"examples/fit_map/#","page":"Maximum a Posteriori","title":"Maximum a Posteriori","text":"using Distributions\nusing HMMBase\nusing PyPlot\nusing Seaborn\n\nrc(\"axes\", xmargin = 0) # hide\nset_style(\"whitegrid\")  # hide","category":"page"},{"location":"examples/fit_map/#","page":"Maximum a Posteriori","title":"Maximum a Posteriori","text":"Let's consider a simple time series with one outlier:","category":"page"},{"location":"examples/fit_map/#","page":"Maximum a Posteriori","title":"Maximum a Posteriori","text":"y = rand(1000)\ny[100] = 10000\nfigure(figsize = (9, 2)) # hide\nplot(y)\ngcf() # hide","category":"page"},{"location":"examples/fit_map/#","page":"Maximum a Posteriori","title":"Maximum a Posteriori","text":"An MLE approach for the observations distributions parameters may fail with a singularity (variance = 0) if an outlier becomes the only observation associated to some state:","category":"page"},{"location":"examples/fit_map/#","page":"Maximum a Posteriori","title":"Maximum a Posteriori","text":"hmm = HMM([0.9 0.1; 0.1 0.9], [Normal(0, 1), Normal(5, 1)])\ntry\n    fit_mle(hmm, y, display = :iter)\ncatch e\n    println(e)\nend","category":"page"},{"location":"examples/fit_map/#","page":"Maximum a Posteriori","title":"Maximum a Posteriori","text":"We can avoid this by putting a prior on the variance:","category":"page"},{"location":"examples/fit_map/#","page":"Maximum a Posteriori","title":"Maximum a Posteriori","text":"import ConjugatePriors: InverseGamma, NormalKnownMu, posterior_canon\nimport StatsBase: Weights\n\nfunction fit_map(::Type{<:Normal}, observations, responsibilities)\n    μ = mean(observations, Weights(responsibilities))\n\n    ss = suffstats(NormalKnownMu(μ), observations, responsibilities)\n    prior = InverseGamma(2, 1)\n    posterior = posterior_canon(prior, ss)\n    σ2 = mode(posterior)\n\n    Normal(μ, sqrt(σ2))\nend\n\nhmm, hist = fit_mle(hmm, y, estimator = fit_map, display = :iter)\nfigure(figsize = (4, 3)) # hide\nplot(hist.logtots)\nxlabel(\"Iteration\") # hide\nylabel(\"Log-likelihood\") # hide\ngcf() # hide","category":"page"},{"location":"examples/fit_map/#","page":"Maximum a Posteriori","title":"Maximum a Posteriori","text":"hmm.B","category":"page"},{"location":"examples/fit_map/#","page":"Maximum a Posteriori","title":"Maximum a Posteriori","text":"","category":"page"},{"location":"examples/fit_map/#","page":"Maximum a Posteriori","title":"Maximum a Posteriori","text":"This page was generated using Literate.jl.","category":"page"},{"location":"basics/#Basics-1","page":"Basics","title":"Basics","text":"","category":"section"},{"location":"basics/#common_options-1","page":"Basics","title":"Common Options","text":"","category":"section"},{"location":"basics/#Arguments-1","page":"Basics","title":"Arguments","text":"","category":"section"},{"location":"basics/#","page":"Basics","title":"Basics","text":"Name Type Default Description\na AbstractVector - Initial probabilities vector\nA AbstractMatrix - Transition matrix\nL AbstractMatrix - (Log-)likelihoods\nrng AbstractRNG GLOBAL_RNG Random number generator to use\nhmm AbstractHMM - HMM model\nobservations AbstractVector or AbstractMatrix - T or T x dim(obs)","category":"page"},{"location":"basics/#Keyword-Arguments-1","page":"Basics","title":"Keyword Arguments","text":"","category":"section"},{"location":"basics/#","page":"Basics","title":"Basics","text":"Name Type Default Description\nlogl Bool false Use log-likelihoods instead of likelihoods, if set to true\nrobust Bool false Truncate -Inf to eps() and +Inf to prevfloat(Inf) (log(prevfloat(Inf)) in the log. case)","category":"page"},{"location":"basics/#Notations-1","page":"Basics","title":"Notations","text":"","category":"section"},{"location":"basics/#","page":"Basics","title":"Basics","text":"Symbol Size Description Definition\nK - Number of states in an HMM _\nT - Number of observations _\na K Initial state distribution sum_i a_i = 1\nA (K, K) Transition matrix sum_j A_ij = 1 forall i\nB K Vector of observation distributions _\nz T Hidden states vector z_1 sim a, z_t sim A_z_t-1bullet\ny (T, .) Observations vector y_t sim B_z_t\nL (T, K) Observations (log-)likelihoods L(ti) = p_B_i(y_t)\nα (T, K) Forward (filter) probabilities alpha(i) = mathbbP(y_1t z_t = i)\nβ (T, K) Backward (smoothed) probabilities beta(i) = mathbbP(y_t+1T  z_t = i)\nγ (T, K) Posterior probabilities (α * β) gamma(i) = mathbbP(z_t = i  y_1T)","category":"page"},{"location":"basics/#","page":"Basics","title":"Basics","text":"Before version 1.0:","category":"page"},{"location":"basics/#","page":"Basics","title":"Basics","text":"Symbol Shape Description\nπ0 K Initial state distribution\nπ KxK Transition matrix\nD K Vector of observation distributions","category":"page"},{"location":"utilities/#Utilities-1","page":"Utilities","title":"Utilities","text":"","category":"section"},{"location":"utilities/#","page":"Utilities","title":"Utilities","text":"gettransmat\nrandtransmat\nremapseq","category":"page"},{"location":"utilities/#HMMBase.gettransmat","page":"Utilities","title":"HMMBase.gettransmat","text":"gettransmat(seq; relabel = false) -> (Dict, Matrix)\n\nReturn the transition matrix associated to the label sequence seq.   The labels must be positive integer.  \n\nArguments\n\nseq::Vector{<:Integer}: positive label sequence.\n\nKeyword Arguments\n\nrelabel::Bool = false: if set to true the sequence will be made contiguous. E.g. [7,7,9,9,1,1] will become [2,2,3,3,1,1].\n\nOutput\n\nDict{Integer,Integer}: the mapping between the original and the new labels.\nMatrix{Float64}: the transition matrix.\n\n\n\n\n\n","category":"function"},{"location":"utilities/#HMMBase.randtransmat","page":"Utilities","title":"HMMBase.randtransmat","text":"randtransmat([rng,] prior) -> Matrix{Float64}\n\nGenerate a transition matrix where each row is sampled from prior.   The prior must be a multivariate probability distribution, such as a Dirichlet distribution.\n\nArguments\n\nprior::MultivariateDistribution: distribution over the transition matrix rows.\n\nExample\n\nA = randtransmat(Dirichlet([0.1, 0.1, 0.1]))\n\n\n\n\n\nrandtransmat([rng, ]K, α = 1.0) -> Matrix{Float64}\n\nGenerate a transition matrix where each row is sampled from a Dirichlet distribution of dimension K and concentration parameter α.\n\nArguments\n\nK::Integer: number of states.\nα::Float64 = 1.0: concentration parameter of the Dirichlet distribution.\n\nExample\n\nA = randtransmat(4)\n\n\n\n\n\n","category":"function"},{"location":"utilities/#HMMBase.remapseq","page":"Utilities","title":"HMMBase.remapseq","text":"remapseq(seq, ref) -> Vector{Integer}\n\nFind the permutations of seq indices that maximize the overlap with ref.\n\nArguments\n\nseq::Vector{Integer}: sequence to be remapped.\nref::Vector{Integer}: reference sequence.\n\nExample\n\nref = [1,1,2,2,3,3]\nseq = [2,2,3,3,1,1]\nremapseq(seq, ref)\n# [1,1,2,2,3,3]\n\n\n\n\n\n","category":"function"},{"location":"_index/#Index-1","page":"Index","title":"Index","text":"","category":"section"},{"location":"_index/#","page":"Index","title":"Index","text":"","category":"page"},{"location":"models/#Model-1","page":"Model","title":"Model","text":"","category":"section"},{"location":"models/#","page":"Model","title":"Model","text":"See common options for the documentation of a, A, L, ...","category":"page"},{"location":"models/#HMM-1","page":"Model","title":"HMM","text":"","category":"section"},{"location":"models/#","page":"Model","title":"Model","text":"HMM\nrand\nsize\nnparams\npermute\nistransmat\ncopy","category":"page"},{"location":"models/#HMMBase.HMM","page":"Model","title":"HMMBase.HMM","text":"HMM([a, ]A, B) -> HMM\n\nBuild an HMM with transition matrix A and observation distributions B.   If the initial state distribution a is not specified, a uniform distribution is assumed. \n\nObservations distributions can be of different types (for example Normal and Exponential),   but they must be of the same dimension.\n\nAlternatively, B can be an emission matrix where B[i,j] is the probability of observing symbol j in state i.\n\nArguments\n\na::AbstractVector{T}: initial probabilities vector.\nA::AbstractMatrix{T}: transition matrix.\nB::AbstractVector{<:Distribution{F}}: observations distributions.\nor B::AbstractMatrix: emission matrix.\n\nExample\n\nusing Distributions, HMMBase\n# from distributions\nhmm = HMM([0.9 0.1; 0.1 0.9], [Normal(0,1), Normal(10,1)])\n# from an emission matrix\nhmm = HMM([0.9 0.1; 0.1 0.9], [0. 0.5 0.5; 0.25 0.25 0.5])\n\n\n\n\n\n","category":"type"},{"location":"models/#Base.rand","page":"Model","title":"Base.rand","text":"rand([rng, ]hmm, T; init, seq) -> Array | (Vector, Array)\n\nSample a trajectory of T timesteps from hmm.\n\nKeyword Arguments\n\ninit::Integer = rand(Categorical(hmm.a)): initial state.\nseq::Bool = false: whether to return the hidden state sequence or not.\n\nOutput\n\nVector{Int} (if seq == true): hidden state sequence.\nVector{Float64} (for Univariate HMMs): observations (T).\nMatrix{Float64} (for Multivariate HMMs): observations (T x dim(obs)).\n\nExamples\n\nusing Distributions, HMMBase\nhmm = HMM([0.9 0.1; 0.1 0.9], [Normal(0,1), Normal(10,1)])\ny = rand(hmm, 1000) # or\nz, y = rand(hmm, 1000, seq = true)\nsize(y) # (1000,)\n\nusing Distributions, HMMBase\nhmm = HMM([0.9 0.1; 0.1 0.9], [MvNormal(ones(2)), MvNormal(ones(2))])\ny = rand(hmm, 1000) # or\nz, y = rand(hmm, 1000, seq = true)\nsize(y) # (1000, 2)\n\n\n\n\n\nrand([rng, ]hmm, z) -> Array\n\nSample observations from hmm according to trajectory z.\n\nOutput\n\nVector{Float64} (for Univariate HMMs): observations (T).\nMatrix{Float64} (for Multivariate HMMs): observations (T x dim(obs)).\n\nExample\n\nusing Distributions, HMMBase\nhmm = HMM([0.9 0.1; 0.1 0.9], [Normal(0,1), Normal(10,1)])\ny = rand(hmm, [1, 1, 2, 2, 1])\n\n\n\n\n\n","category":"function"},{"location":"models/#Base.size","page":"Model","title":"Base.size","text":"size(hmm, [dim]) -> Int | Tuple\n\nReturn the number of states in hmm and the dimension of the observations.\n\nExample\n\nusing Distributions, HMMBase\nhmm = HMM([0.9 0.1; 0.1 0.9], [Normal(0,1), Normal(10,1)])\nsize(hmm)\n# output\n(2, 1)\n\n\n\n\n\n","category":"function"},{"location":"models/#HMMBase.nparams","page":"Model","title":"HMMBase.nparams","text":"nparams(hmm) -> Int\n\nReturn the number of free parameters in hmm, without counting the observation distributions parameters.\n\nExample\n\nusing Distributions, HMMBase\nhmm = HMM([0.9 0.1; 0.1 0.9], [Normal(0,1), Normal(10,1)])\nnparams(hmm)\n# output\n3\n\n\n\n\n\n","category":"function"},{"location":"models/#HMMBase.permute","page":"Model","title":"HMMBase.permute","text":"permute(hmm, perm) -> HMM\n\nPermute the states of hmm according to perm.\n\nArguments\n\nperm::Vector{<:Integer}: permutation of the states.\n\nExample\n\nusing Distributions, HMMBase\nhmm = HMM([0.8 0.2; 0.1 0.9], [Normal(0,1), Normal(10,1)])\nhmm = permute(hmm, [2, 1])\nhmm.A # [0.9 0.1; 0.2 0.8]\nhmm.B # [Normal(10,1), Normal(0,1)]\n\n\n\n\n\n","category":"function"},{"location":"models/#HMMBase.istransmat","page":"Model","title":"HMMBase.istransmat","text":"istransmat(A) -> Bool\n\nReturn true if A is square and its rows sums to 1.\n\n\n\n\n\n","category":"function"},{"location":"models/#Base.copy","page":"Model","title":"Base.copy","text":"copy(hmm) -> HMM\n\nReturn a copy of hmm.\n\n\n\n\n\n","category":"function"},{"location":"models/#Observations-Likelihoods-1","page":"Model","title":"Observations Likelihoods","text":"","category":"section"},{"location":"models/#","page":"Model","title":"Model","text":"likelihoods\nloglikelihood","category":"page"},{"location":"models/#HMMBase.likelihoods","page":"Model","title":"HMMBase.likelihoods","text":"likelihoods(hmm, observations; logl) -> Matrix\n\nReturn the likelihood per-state and per-observation.\n\nOutput\n\nMatrix{Float64}: likelihoods matrix (T x K).\n\nExample\n\nusing Distributions, HMMBase\nhmm = HMM([0.9 0.1; 0.1 0.9], [Normal(0,1), Normal(10,1)])\ny = rand(hmm, 1000)\nL = likelihoods(hmm, y)\nLL = likelihoods(hmm, y, logl = true)\n\n\n\n\n\n","category":"function"},{"location":"models/#StatsBase.loglikelihood","page":"Model","title":"StatsBase.loglikelihood","text":"loglikelihood(hmm, observations; logl, robust) -> Float64\n\nCompute the log-likelihood of the observations under the model.   This is defined as the sum of the log of the normalization coefficients in the forward filter.\n\nOutput\n\nFloat64: log-likelihood of the observations sequence under the model.\n\nExample\n\nusing Distributions, HMMBase\nhmm = HMM([0.9 0.1; 0.1 0.9], [Normal(0,1), Normal(10,1)])\nloglikelihood(hmm, [0.15, 0.10, 1.35])\n# output\n-4.588183811489616\n\n\n\n\n\n","category":"function"},{"location":"models/#Stationnary-Distribution-1","page":"Model","title":"Stationnary Distribution","text":"","category":"section"},{"location":"models/#","page":"Model","title":"Model","text":"statdists","category":"page"},{"location":"models/#HMMBase.statdists","page":"Model","title":"HMMBase.statdists","text":"statdists(hmm) -> Vector{Vector}\n\nReturn the stationnary distribution(s) of hmm.   That is, the eigenvectors of transpose(hmm.A) with eigenvalues 1.\n\n\n\n\n\n","category":"function"},{"location":"models/#Abstract-Type-1","page":"Model","title":"Abstract Type","text":"","category":"section"},{"location":"models/#","page":"Model","title":"Model","text":"AbstractHMM","category":"page"},{"location":"models/#HMMBase.AbstractHMM","page":"Model","title":"HMMBase.AbstractHMM","text":"AbstractHMM{F<:VariateForm}\n\nA custom HMM type must at-least implement the following interface:\n\nstruct CustomHMM{F,T} <: AbstractHMM{F}\n    a::AbstractVector{T}               # Initial state distribution\n    A::AbstractMatrix{T}               # Transition matrix\n    B::AbstractVector{Distribution{F}} # Observations distributions\n    # Optional, custom, fields ....\nend\n\n\n\n\n\n","category":"type"},{"location":"migration/#Migrating-to-v1.0-1","page":"Migrating to v1.0","title":"Migrating to v1.0","text":"","category":"section"},{"location":"migration/#","page":"Migrating to v1.0","title":"Migrating to v1.0","text":"HMMBase v1.0 introduces the following breaking changes:","category":"page"},{"location":"migration/#","page":"Migrating to v1.0","title":"Migrating to v1.0","text":"HMM struct renaming: π0, π, D become a, A, B\nRemoval of StaticHMM and StaticArrays dependency\nMethods renaming, see below for a full list\nForward/Backward algorithms uses likelihood by default (instead of log-likelihoods), use the logl option to use log-likelihoods\nBaum-Welch algorithm returns hmm, history instead of hmm, logtot\nrand(hmm, T) returns y instead of z, y by default, use seq = true to get z, y","category":"page"},{"location":"migration/#Deprecated/renamed-methods-1","page":"Migrating to v1.0","title":"Deprecated/renamed methods","text":"","category":"section"},{"location":"migration/#","page":"Migrating to v1.0","title":"Migrating to v1.0","text":"# @deprecate old new\n\n@deprecate n_parameters(hmm) nparams(hmm)\n@deprecate log_likelihoods(hmm, observations) likelihoods(hmm, observations, logl = true)\n\n@deprecate forward_backward(init_distn, trans_matrix, log_likelihoods) posteriors(init_distn, trans_matrix, log_likelihoods, logl = true)\n@deprecate messages_forwards(init_distn, trans_matrix, log_likelihoods) forward(init_distn, trans_matrix, log_likelihoods, logl = true)\n@deprecate messages_backwards(init_distn, trans_matrix, log_likelihoods) backward(init_distn, trans_matrix, log_likelihoods, logl = true)\n\n@deprecate forward_backward(hmm, observations) posteriors(hmm, observations, logl = true)\n@deprecate messages_forwards(hmm, observations) forward(hmm, observations, logl = true)\n@deprecate messages_backwards(hmm, observations) backward(hmm, observations, logl = true)\n\n@deprecate messages_forwards_log(init_distn, trans_matrix, log_likelihoods) log.(forward(init_distn, trans_matrix, log_likelihoods, logl = true)[1])\n@deprecate messages_backwards_log(trans_matrix, log_likelihoods) log.(backward(init_distn, trans_matrix, log_likelihoods, logl = true)[1])\n\n@deprecate compute_transition_matrix(seq) gettransmat(seq, relabel = true)\n@deprecate rand_transition_matrix(K, α = 1.0) randtransmat(K, α)","category":"page"},{"location":"examples/numerical_stability/#","page":"Numerical Stability","title":"Numerical Stability","text":"EditURL = \"https://github.com/maxmouchet/HMMBase.jl/blob/master/examples/numerical_stability.jl\"","category":"page"},{"location":"examples/numerical_stability/#Numerical-Stability-1","page":"Numerical Stability","title":"Numerical Stability","text":"","category":"section"},{"location":"examples/numerical_stability/#","page":"Numerical Stability","title":"Numerical Stability","text":"using Distributions\nusing HMMBase\nusing PyPlot\nusing Seaborn\n\nrc(\"axes\", xmargin = 0) # hide\nset_style(\"whitegrid\")  # hide","category":"page"},{"location":"examples/numerical_stability/#","page":"Numerical Stability","title":"Numerical Stability","text":"Let's consider the case of a Normal distribution with null variance, such a case can appear during maximum likelihood estimation if only one observation is associated to a state:","category":"page"},{"location":"examples/numerical_stability/#","page":"Numerical Stability","title":"Numerical Stability","text":"A = [0.99 0.01; 0.1 0.9]\nB = [Normal(0, 1), Normal(10.5, 0)]\nhmm = HMM(A, B)","category":"page"},{"location":"examples/numerical_stability/#","page":"Numerical Stability","title":"Numerical Stability","text":"y = rand(hmm, 500)\nfigure(figsize = (9, 2)) # hide\nplot(y)\ngcf() # hide","category":"page"},{"location":"examples/numerical_stability/#","page":"Numerical Stability","title":"Numerical Stability","text":"The likelihood of a Normal distribution with null variance goes to infinity for y = μ, as there is a division by zero in the density function:","category":"page"},{"location":"examples/numerical_stability/#","page":"Numerical Stability","title":"Numerical Stability","text":"println(extrema(likelihoods(hmm, y)))\nprintln(extrema(likelihoods(hmm, y, logl = true)))","category":"page"},{"location":"examples/numerical_stability/#","page":"Numerical Stability","title":"Numerical Stability","text":"To avoid propagating these non-finite quantities (for example in the forward-backward algorithm), you can use the robust option:","category":"page"},{"location":"examples/numerical_stability/#","page":"Numerical Stability","title":"Numerical Stability","text":"println(extrema(likelihoods(hmm, y, robust = true)))\nprintln(extrema(likelihoods(hmm, y, logl = true, robust = true)))","category":"page"},{"location":"examples/numerical_stability/#","page":"Numerical Stability","title":"Numerical Stability","text":"This truncates +Inf to the largest Float64, and -Inf to the smallest Float64:","category":"page"},{"location":"examples/numerical_stability/#","page":"Numerical Stability","title":"Numerical Stability","text":"prevfloat(Inf), nextfloat(-Inf)","category":"page"},{"location":"examples/numerical_stability/#","page":"Numerical Stability","title":"Numerical Stability","text":"In the log. case we use log(prevfloat(Inf)) to avoid overflows when taking the exp. of the log-likelihood.","category":"page"},{"location":"examples/numerical_stability/#","page":"Numerical Stability","title":"Numerical Stability","text":"","category":"page"},{"location":"examples/numerical_stability/#","page":"Numerical Stability","title":"Numerical Stability","text":"This page was generated using Literate.jl.","category":"page"},{"location":"internals/#Internals-1","page":"Internals","title":"Internals","text":"","category":"section"},{"location":"internals/#","page":"Internals","title":"Internals","text":"Overview of the repository structure:","category":"page"},{"location":"internals/#","page":"Internals","title":"Internals","text":".\n├── benchmark\n│   ├── benchmarks.jl   # Benchmark suite definition\n│   └── make.jl         # Benchmark runner\n├── docs\n│   ├── src             # Documentation source\n│   └── make.jl         # Documentation builder\n├── examples            # Examples (included in the documentation)\n├── src\n│   ├── HMMBase.jl      # Main module file\n│   ├── hmm.jl          # HMM type, rand, size, ...\n│   ├── *_api.jl        # Public interfaces\n│   ├── *.jl            # Internal in-place implementations\n└── test\n    ├── integration.jl  # Integration tests\n    ├── pyhsmm.jl       # Python tests\n    ├── runtests.jl     # Integration+Unit tests runner\n    └── unit.jl         # Unit tests\n","category":"page"},{"location":"internals/#In-place-versions-1","page":"Internals","title":"In-place versions","text":"","category":"section"},{"location":"internals/#","page":"Internals","title":"Internals","text":"Internally HMMBase uses in-place implementations for most of the algorithms.","category":"page"},{"location":"internals/#","page":"Internals","title":"Internals","text":"Public interfaces are defined in _api.jl files, and are responsible for copying user provided data.","category":"page"},{"location":"internals/#","page":"Internals","title":"Internals","text":"In-place Public interface\nlikelihoods!, loglikelihoods! likelihoods\nforward!, forwardlog! forward\nbackward!, backwardlog! backward\nposteriors! posteriors\nviterbi!, viterbilog! viterbi\nfit_mle! fit_mle","category":"page"},{"location":"examples/basic_usage/#","page":"Basic Usage","title":"Basic Usage","text":"EditURL = \"https://github.com/maxmouchet/HMMBase.jl/blob/master/examples/basic_usage.jl\"","category":"page"},{"location":"examples/basic_usage/#Basic-Usage-1","page":"Basic Usage","title":"Basic Usage","text":"","category":"section"},{"location":"examples/basic_usage/#","page":"Basic Usage","title":"Basic Usage","text":"using Distributions\nusing HMMBase\nusing PyPlot\nusing Seaborn\n\nrc(\"axes\", xmargin = 0) # hide\nset_style(\"whitegrid\")  # hide","category":"page"},{"location":"examples/basic_usage/#Model-Specification-1","page":"Basic Usage","title":"Model Specification","text":"","category":"section"},{"location":"examples/basic_usage/#","page":"Basic Usage","title":"Basic Usage","text":"B can contains any probability distribution from the Distributions package","category":"page"},{"location":"examples/basic_usage/#","page":"Basic Usage","title":"Basic Usage","text":"a = [0.6, 0.4]\nA = [0.9 0.1; 0.1 0.9]\nB = [MvNormal([0.0, 5.0], ones(2) * 1), MvNormal([0.0, 5.0], ones(2) * 3)]\nhmm = HMM(a, A, B)\nsize(hmm) # (number of states, observations dimension)","category":"page"},{"location":"examples/basic_usage/#Sampling-1","page":"Basic Usage","title":"Sampling","text":"","category":"section"},{"location":"examples/basic_usage/#","page":"Basic Usage","title":"Basic Usage","text":"z, y = rand(hmm, 500, seq = true)","category":"page"},{"location":"examples/basic_usage/#","page":"Basic Usage","title":"Basic Usage","text":"Let's plot the observations and the hidden state sequence:","category":"page"},{"location":"examples/basic_usage/#","page":"Basic Usage","title":"Basic Usage","text":"_, axes = subplots(nrows = 2, figsize = (9, 3))\naxes[1].plot(y)\naxes[2].plot(z, linestyle = :steps)\ngcf() # hide","category":"page"},{"location":"examples/basic_usage/#","page":"Basic Usage","title":"Basic Usage","text":"We can also drop the time dimension and plot the data in the plane:","category":"page"},{"location":"examples/basic_usage/#","page":"Basic Usage","title":"Basic Usage","text":"_, axes = subplots(ncols = 2, figsize = (9, 3))\naxes[1].scatter(y[:, 1], y[:, 2], s = 3.0)\naxes[2].scatter(y[:, 1], y[:, 2], s = 3.0, c = z, cmap = \"tab10\")\naxes[1].set_title(\"Observations\")\naxes[2].set_title(\"Observations and hidden states\")\ngcf() # hide","category":"page"},{"location":"examples/basic_usage/#Inference-1","page":"Basic Usage","title":"Inference","text":"","category":"section"},{"location":"examples/basic_usage/#","page":"Basic Usage","title":"Basic Usage","text":"α, logtot = forward(hmm, y)\nβ, logtot = backward(hmm, y)\n\nγ = posteriors(hmm, y) # or\nγ = posteriors(α, β)\n\nsize(α), size(β), size(γ)","category":"page"},{"location":"examples/basic_usage/#","page":"Basic Usage","title":"Basic Usage","text":"figure(figsize = (9, 2)) # hide\nplot([α[:, 1] β[:, 1] γ[:, 1]])\nlegend([\"Forward\", \"Backward\", \"Posteriors\"], loc = \"upper right\")\ngcf() # hide","category":"page"},{"location":"examples/basic_usage/#","page":"Basic Usage","title":"Basic Usage","text":"_, axes = subplots(ncols = 3, figsize = (9, 3))\nfor (ax, probs, title) in zip(axes, [α, β, γ], [\"Forward\", \"Backward\", \"Posteriors\"])\n    ax.scatter(y[:, 1], y[:, 2], s = 3.0, c = probs[:, 1], cmap = \"Reds\")\n    ax.set_title(title)\nend\ngcf() # hide","category":"page"},{"location":"examples/basic_usage/#","page":"Basic Usage","title":"Basic Usage","text":"z_map = [z.I[2] for z in argmax(γ, dims = 2)][:]\nz_viterbi = viterbi(hmm, y)\n\nfigure(figsize = (9, 2)) # hide\nplot([z z_map z_viterbi])\nlegend([\"True sequence\", \"MAP\", \"Viterbi\"], loc = \"upper right\")\ngcf() # hide","category":"page"},{"location":"examples/basic_usage/#","page":"Basic Usage","title":"Basic Usage","text":"_, axes = subplots(ncols = 2, figsize = (9, 3))\nfor (ax, seq, title) in zip(axes, [z_map, z_viterbi], [\"MAP\", \"Viterbi\"])\n    ax.scatter(y[:, 1], y[:, 2], s = 3.0, c = seq, cmap = \"Reds_r\")\n    ax.set_title(title)\nend\ngcf() # hide","category":"page"},{"location":"examples/basic_usage/#Parameters-Estimation-1","page":"Basic Usage","title":"Parameters Estimation","text":"","category":"section"},{"location":"examples/basic_usage/#","page":"Basic Usage","title":"Basic Usage","text":"hmm = HMM(randtransmat(2), [MvNormal(rand(2), ones(2)), MvNormal(rand(2), ones(2))])\nhmm, hist = fit_mle(hmm, y, display = :iter, init = :kmeans)\nhmm","category":"page"},{"location":"examples/basic_usage/#","page":"Basic Usage","title":"Basic Usage","text":"figure(figsize = (4, 3)) # hide\nplot(hist.logtots)\ngcf() # hide","category":"page"},{"location":"examples/basic_usage/#","page":"Basic Usage","title":"Basic Usage","text":"","category":"page"},{"location":"examples/basic_usage/#","page":"Basic Usage","title":"Basic Usage","text":"This page was generated using Literate.jl.","category":"page"},{"location":"algorithms/#Algorithms-1","page":"Algorithms","title":"Algorithms","text":"","category":"section"},{"location":"algorithms/#","page":"Algorithms","title":"Algorithms","text":"See common options for the documentation of a, A, L, ...","category":"page"},{"location":"algorithms/#Baum–Welch-1","page":"Algorithms","title":"Baum–Welch","text":"","category":"section"},{"location":"algorithms/#","page":"Algorithms","title":"Algorithms","text":"fit_mle","category":"page"},{"location":"algorithms/#Distributions.fit_mle","page":"Algorithms","title":"Distributions.fit_mle","text":"fit_mle(hmm, observations; ...) -> AbstractHMM\n\nEstimate the HMM parameters using the EM (Baum-Welch) algorithm, with hmm as the initial state.\n\nKeyword Arguments\n\ndisplay::Symbol = :none: when to display convergence logs, can be set to :iter or :final.\ninit::Symbol = :none: if set to :kmeans the HMM parameters will be initialized using a K-means clustering.\nmaxiter::Integer = 100: maximum number of iterations to perform.\ntol::Integer = 1e-3: stop the algorithm when the improvement in the log-likelihood is less than tol.\n\nOutput\n\n<:AbstractHMM: a copy of the original HMM with the updated parameters.\n\n\n\n\n\n","category":"function"},{"location":"algorithms/#Forward-Backward-1","page":"Algorithms","title":"Forward-Backward","text":"","category":"section"},{"location":"algorithms/#","page":"Algorithms","title":"Algorithms","text":"forward\nbackward\nposteriors","category":"page"},{"location":"algorithms/#HMMBase.forward","page":"Algorithms","title":"HMMBase.forward","text":"forward(a, A, L; logl) -> (Vector, Float)\n\nCompute forward probabilities using samples likelihoods. See Forward-backward algorithm.\n\nOutput\n\nVector{Float64}: forward probabilities.\nFloat64: log-likelihood of the observed sequence.\n\n\n\n\n\nforward(hmm, observations; logl, robust) -> (Vector, Float)\n\nCompute forward probabilities of the observations given the hmm model.\n\nOutput\n\nVector{Float64}: forward probabilities.\nFloat64: log-likelihood of the observed sequence.\n\nExample\n\nusing Distributions, HMMBase\nhmm = HMM([0.9 0.1; 0.1 0.9], [Normal(0,1), Normal(10,1)])\ny = rand(hmm, 1000)\nprobs, tot = forward(hmm, y)\n\n\n\n\n\n","category":"function"},{"location":"algorithms/#HMMBase.backward","page":"Algorithms","title":"HMMBase.backward","text":"backward(a, A, L; logl) -> (Vector, Float)\n\nCompute backward probabilities using samples likelihoods. See Forward-backward algorithm.\n\nOutput\n\nVector{Float64}: backward probabilities.\nFloat64: log-likelihood of the observed sequence.\n\n\n\n\n\nbackward(hmm, observations; logl, robust) -> (Vector, Float)\n\nCompute backward probabilities of the observations given the hmm model.\n\nOutput\n\nVector{Float64}: backward probabilities.\nFloat64: log-likelihood of the observed sequence.\n\nExample\n\nusing Distributions, HMMBase\nhmm = HMM([0.9 0.1; 0.1 0.9], [Normal(0,1), Normal(10,1)])\ny = rand(hmm, 1000)\nprobs, tot = backward(hmm, y)\n\n\n\n\n\n","category":"function"},{"location":"algorithms/#HMMBase.posteriors","page":"Algorithms","title":"HMMBase.posteriors","text":"posteriors(α, β) -> Vector\n\nCompute posterior probabilities from α and β.\n\nArguments\n\nα::AbstractVector: forward probabilities.\nβ::AbstractVector: backward probabilities.\n\n\n\n\n\nposteriors(a, A, L; logl) -> Vector\n\nCompute posterior probabilities using samples likelihoods.\n\n\n\n\n\nposteriors(hmm, observations; logl, robust) -> Vector\n\nCompute posterior probabilities using samples likelihoods.\n\nExample\n\nusing Distributions, HMMBase\nhmm = HMM([0.9 0.1; 0.1 0.9], [Normal(0,1), Normal(10,1)])\ny = rand(hmm, 1000)\nγ = posteriors(hmm, y)\n\n\n\n\n\n","category":"function"},{"location":"algorithms/#Viterbi-1","page":"Algorithms","title":"Viterbi","text":"","category":"section"},{"location":"algorithms/#","page":"Algorithms","title":"Algorithms","text":"viterbi","category":"page"},{"location":"algorithms/#HMMBase.viterbi","page":"Algorithms","title":"HMMBase.viterbi","text":"viterbi(a, A, L; logl) -> Vector\n\nFind the most likely hidden state sequence, see Viterbi algorithm.\n\n\n\n\n\nviterbi(hmm, observations; logl, robust) -> Vector\n\nExample\n\nusing Distributions, HMMBase\nhmm = HMM([0.9 0.1; 0.1 0.9], [Normal(0,1), Normal(10,1)])\ny = rand(hmm, 1000)\nzv = viterbi(hmm, y)\n\n\n\n\n\n","category":"function"},{"location":"#Home-1","page":"Home","title":"Home","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"(View project on GitHub)","category":"page"},{"location":"#","page":"Home","title":"Home","text":"HMMBase provides a lightweight and efficient abstraction for hidden Markov models in Julia. Most HMMs libraries only support discrete (e.g. categorical) or normal distributions. In contrast HMMBase builds upon Distributions.jl to support arbitrary univariate and multivariate distributions.  ","category":"page"},{"location":"#","page":"Home","title":"Home","text":"The goal is to provide well-tested and fast implementations of the basic HMMs algorithms such as the forward-backward algorithm, the Viterbi algorithm, and the MLE estimator. More advanced models, such as Bayesian HMMs, can be built upon HMMBase.","category":"page"},{"location":"#Getting-Started-1","page":"Home","title":"Getting Started","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"The package can be installed with the Julia package manager. From the Julia REPL, type ] to enter the Pkg REPL mode and run:","category":"page"},{"location":"#","page":"Home","title":"Home","text":"pkg> add HMMBase","category":"page"},{"location":"#","page":"Home","title":"Home","text":"HMMBase supports any observations distributions implementing the Distribution interface from Distributions.jl.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"using Distributions, HMMBase\n\n# Univariate continuous observations\nhmm = HMM([0.9 0.1; 0.1 0.9], [Normal(0,1), Gamma(1,1)])\n\n# Multivariate continuous observations\nhmm = HMM([0.9 0.1; 0.1 0.9], [MvNormal([0.,0.],[1.,1.]), MvNormal([0.,0.],[1.,1.])])\n\n# Univariate discrete observations\nhmm = HMM([0.9 0.1; 0.1 0.9], [Categorical([0.3, 0.7]), Categorical([0.8, 0.2])])\n\n# Multivariate discrete observations\nhmm = HMM([0.9 0.1; 0.1 0.9], [Multinomial(10, [0.3, 0.7]), Multinomial(10, [0.8, 0.2])])","category":"page"},{"location":"#","page":"Home","title":"Home","text":"See the Manual section for more details on the models and algorithms, or jump directly to the Examples.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Logo: lego by jon trillana from the Noun Project.","category":"page"}]
}
