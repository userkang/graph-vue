export default `
    <div class="ml_chart_tooltip">
        <p class="ml_chart_tooltip-header">
            <span>eval_batch</span>
            <span class="ml_chart_bold-text"><%= batch %></span>
        </p>
        <p>
            <span>time_stamp</span>
            <span class="ml_chart_bold-text"><%= reportTime %></span>
        </p>
        <div class="ml_chart_tooltip-body">
          <% _.forEach(list, function(item) { %>
                <div class="ml_chart_tooltip-body-el mr30">
                    <div class="ml10">
                        <p class="ml_chart_linespace">
                            <span class="ml_chart_marker" style=" <%= item.style %>"></span>
                        </p>
                        <p class="ml_chart_linespace">
                            <span>epoch</span>
                            <span class="ml_chart_bold-text"><%= item.epoch %></span>
                        </p>
                        <p class="ml_chart_linespace">
                            <span>auc<% if(item.isEpoach) { %>（加权平均）<% } %></span>
                            <span class="ml_chart_bold-text"><%= item.auc %></span>
                        </p>
                        <p class="ml_chart_linespace">
                            <span>loss<% if(item.isEpoach) { %>（加权平均）<% } %></span>
                            <span class="ml_chart_bold-text"><%= item.loss %></span>
                        </p>
                        <% if(!item.isEpoach) { %>
                        <p class="ml_chart_linespace">
                            <span>agv_l</span>
                            <span class="ml_chart_bold-text"><%= item.avgL %></span>
                        </p>
                        <p class="ml_chart_linespace">
                            <span>agv_p</span>
                            <span class="ml_chart_bold-text"><%= item.avgP %></span>
                        </p>
                        <p class="ml_chart_linespace">
                            <span>ins_num</span>
                            <span class="ml_chart_bold-text"><%= item.insNum %></span>
                        </p>
                        <% } %>
                    </div>
                </div>
          <% }) %>
        </div>
    </div>
`;
